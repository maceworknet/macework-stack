"use server";

import { unlink } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { siteContent } from "@/content/site-content";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalValue(formData: FormData, key: string) {
  const current = value(formData, key);
  return current.length ? current : null;
}

function boolValue(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function publishedValue(formData: FormData) {
  const intent = value(formData, "publishIntent");

  if (intent === "draft") return false;
  if (intent === "publish") return true;

  return boolValue(formData, "published");
}

function numberValue(formData: FormData, key: string, fallback = 0) {
  const current = Number(value(formData, key));
  return Number.isFinite(current) ? current : fallback;
}

function lines(input: string) {
  return input
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function featureJson(formData: FormData, key = "features") {
  return lines(value(formData, key)).map((title) => ({ title }));
}

function tagsJson(formData: FormData, key = "tags") {
  return lines(value(formData, key));
}

function normalizeSlug(raw: string, fallback: string) {
  const source = raw || fallback;

  return source
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function dateValue(formData: FormData, key: string) {
  const input = value(formData, key);
  if (!input) return null;

  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function nullableJsonValue(value: string | null) {
  return value ? value : Prisma.DbNull;
}

function revalidateRoutes(routes: Array<string | null | undefined>) {
  const uniqueRoutes = Array.from(new Set(routes.filter(Boolean) as string[]));
  uniqueRoutes.forEach((route) => revalidatePath(route));
}

function revalidateSite(extraRoutes: Array<string | null | undefined> = []) {
  revalidateRoutes([
    "/",
    "/admin",
    "/admin/products",
    "/admin/services",
    "/admin/projects",
    "/admin/templates",
    "/admin/blog",
    "/admin/messages",
    "/admin/media",
    "/admin/settings",
    "/urunler",
    "/cozumler",
    "/islerimiz",
    "/sablonlar",
    "/blog",
    ...extraRoutes,
  ]);
}

function objectValue(input: unknown): Record<string, any> {
  if (input && typeof input === "object" && !Array.isArray(input)) {
    return input as Record<string, any>;
  }

  return {};
}

function assignTextIfPresent(target: Record<string, any>, formData: FormData, key: string) {
  if (formData.has(key)) {
    target[key] = value(formData, key);
  }
}

async function settingObjectForKey(key: string) {
  const previous = await prisma.siteSetting.findUnique({
    where: { key },
    select: { value: true },
  });

  return objectValue(previous?.value);
}

async function upsertSettingObject(key: string, data: Record<string, any>) {
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: data },
    update: { value: data },
  });
}

function multiValues(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((item) => String(item).trim())
    .filter(Boolean);
}

function textPairs(input: string) {
  return lines(input).map((line) => {
    const [label, ...valueParts] = line.split("|");

    return {
      label: label.trim(),
      value: valueParts.join("|").trim(),
    };
  });
}

function trustedLogosJson(formData: FormData) {
  const urls = lines(value(formData, "trusted_brands_logo_urls"));
  const altTexts = lines(value(formData, "trusted_brands_logo_alt_texts"));
  const links = lines(value(formData, "trusted_brands_logo_links"));

  return urls.map((url, index) => ({
    url,
    alternativeText: altTexts[index] ?? `Logo ${index + 1}`,
    href: links[index] ?? "",
  }));
}

function whyFeatureJson(formData: FormData) {
  return Array.from({ length: 4 }, (_, index) => {
    const title = value(formData, `why_feature_title_${index}`);
    const description = value(formData, `why_feature_description_${index}`);
    const icon = value(formData, `why_feature_icon_${index}`) || "zap";

    return { icon, title, description };
  }).filter((feature) => feature.title || feature.description);
}

function processStepJson(formData: FormData) {
  return Array.from({ length: 4 }, (_, index) => {
    const title = value(formData, `process_step_title_${index}`);
    const description = value(formData, `process_step_description_${index}`);
    const stepNumber =
      value(formData, `process_step_number_${index}`) || String(index + 1).padStart(2, "0");

    return {
      step_number: stepNumber,
      title,
      description,
    };
  }).filter((step) => step.title || step.description);
}

function aboutStatsJson(formData: FormData) {
  return Array.from({ length: 4 }, (_, index) => {
    const label = value(formData, `stat_label_${index}`);
    const statValue = value(formData, `stat_value_${index}`);

    return { label, value: statValue };
  }).filter((stat) => stat.label || stat.value);
}

function publishedSelect(formData: FormData, key: string) {
  return value(formData, key) !== "false";
}

function sortedByOrder<T extends { sortOrder: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

async function findRecordSlug<T extends { slug: string }>(
  finder: () => Promise<T | null>,
  fallbackSlug?: string | null
) {
  const record = await finder().catch(() => null);
  return record?.slug ?? fallbackSlug ?? null;
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();

  const id = optionalValue(formData, "id");
  const title = value(formData, "title");
  const slug = normalizeSlug(value(formData, "slug"), title);

  if (!title || !slug) return;

  const previousSlug = id
    ? await findRecordSlug(() => prisma.product.findUnique({ where: { id }, select: { slug: true } }))
    : null;

  const data = {
    title,
    slug,
    description: value(formData, "description"),
    shortDescription: optionalValue(formData, "shortDescription"),
    longDescription: optionalValue(formData, "longDescription"),
    badge: optionalValue(formData, "badge"),
    tag: optionalValue(formData, "tag"),
    category: optionalValue(formData, "category"),
    version: optionalValue(formData, "version"),
    platformType: optionalValue(formData, "platformType"),
    platformUrl: optionalValue(formData, "platformUrl"),
    coverImage: optionalValue(formData, "coverImage"),
    features: featureJson(formData),
    contentBlocks: Prisma.DbNull,
    published: publishedValue(formData),
    sortOrder: numberValue(formData, "sortOrder"),
  };

  if (id) {
    await prisma.product.update({
      where: { id },
      data,
    });
  } else {
    await prisma.product.upsert({
      where: { slug },
      create: data,
      update: data,
    });
  }

  revalidateSite([`/urunler/${slug}`, previousSlug ? `/urunler/${previousSlug}` : null]);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();

  const id = optionalValue(formData, "id");
  const slug = optionalValue(formData, "slug");

  const currentSlug = await findRecordSlug(
    () =>
      id
        ? prisma.product.findUnique({ where: { id }, select: { slug: true } })
        : prisma.product.findUnique({ where: { slug: slug ?? "" }, select: { slug: true } }),
    slug
  );

  if (id) {
    await prisma.product.delete({ where: { id } }).catch(() => null);
  } else if (slug) {
    await prisma.product.delete({ where: { slug } }).catch(() => null);
  }

  revalidateSite([currentSlug ? `/urunler/${currentSlug}` : null]);
}

export async function saveSolutionAction(formData: FormData) {
  await requireAdmin();

  const id = optionalValue(formData, "id");
  const title = value(formData, "title");
  const slug = normalizeSlug(value(formData, "slug"), title);

  if (!title || !slug) return;

  const previousSlug = id
    ? await findRecordSlug(() => prisma.solution.findUnique({ where: { id }, select: { slug: true } }))
    : null;

  const data = {
    title,
    slug,
    badgeText: optionalValue(formData, "badgeText"),
    shortDescription: optionalValue(formData, "shortDescription"),
    description: value(formData, "description"),
    icon: optionalValue(formData, "icon"),
    category: optionalValue(formData, "category"),
    coverImage: optionalValue(formData, "coverImage"),
    features: featureJson(formData),
    published: publishedValue(formData),
    sortOrder: numberValue(formData, "sortOrder"),
  };

  if (id) {
    await prisma.solution.update({
      where: { id },
      data,
    });
  } else {
    await prisma.solution.upsert({
      where: { slug },
      create: data,
      update: data,
    });
  }

  revalidateSite([`/cozumler/${slug}`, previousSlug ? `/cozumler/${previousSlug}` : null]);
}

export async function deleteSolutionAction(formData: FormData) {
  await requireAdmin();

  const id = optionalValue(formData, "id");
  const slug = optionalValue(formData, "slug");

  const currentSlug = await findRecordSlug(
    () =>
      id
        ? prisma.solution.findUnique({ where: { id }, select: { slug: true } })
        : prisma.solution.findUnique({ where: { slug: slug ?? "" }, select: { slug: true } }),
    slug
  );

  if (id) {
    await prisma.solution.delete({ where: { id } }).catch(() => null);
  } else if (slug) {
    await prisma.solution.delete({ where: { slug } }).catch(() => null);
  }

  revalidateSite([currentSlug ? `/cozumler/${currentSlug}` : null]);
}

export async function saveProjectAction(formData: FormData) {
  await requireAdmin();

  const id = optionalValue(formData, "id");
  const title = value(formData, "title");
  const slug = normalizeSlug(value(formData, "slug"), title);

  if (!title || !slug) return;

  const previousSlug = id
    ? await findRecordSlug(() => prisma.project.findUnique({ where: { id }, select: { slug: true } }))
    : null;
  const gallery = tagsJson(formData, "gallery");
  const coverImage = optionalValue(formData, "coverImage") ?? gallery[0] ?? null;

  const data = {
    title,
    slug,
    description: value(formData, "description"),
    longDescription: optionalValue(formData, "longDescription"),
    category: optionalValue(formData, "category"),
    client: optionalValue(formData, "client"),
    year: optionalValue(formData, "year"),
    liveUrl: optionalValue(formData, "liveUrl"),
    ctaButtonLabel: optionalValue(formData, "ctaButtonLabel"),
    ctaButtonUrl: optionalValue(formData, "ctaButtonUrl"),
    coverImage,
    gallery,
    tags: tagsJson(formData, "tags"),
    featured: boolValue(formData, "featured"),
    published: publishedValue(formData),
    sortOrder: numberValue(formData, "sortOrder"),
  };

  if (id) {
    await prisma.project.update({
      where: { id },
      data,
    });
  } else {
    await prisma.project.upsert({
      where: { slug },
      create: data,
      update: data,
    });
  }

  revalidateSite([`/islerimiz/${slug}`, previousSlug ? `/islerimiz/${previousSlug}` : null]);
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdmin();

  const id = optionalValue(formData, "id");
  const slug = optionalValue(formData, "slug");

  const currentSlug = await findRecordSlug(
    () =>
      id
        ? prisma.project.findUnique({ where: { id }, select: { slug: true } })
        : prisma.project.findUnique({ where: { slug: slug ?? "" }, select: { slug: true } }),
    slug
  );

  if (id) {
    await prisma.project.delete({ where: { id } }).catch(() => null);
  } else if (slug) {
    await prisma.project.delete({ where: { slug } }).catch(() => null);
  }

  revalidateSite([currentSlug ? `/islerimiz/${currentSlug}` : null]);
}

export async function saveTemplateAction(formData: FormData) {
  await requireAdmin();

  const id = optionalValue(formData, "id");
  const title = value(formData, "title");
  const slug = normalizeSlug(value(formData, "slug"), title);

  if (!title || !slug) return;

  const previousSlug = id
    ? await findRecordSlug(() => prisma.template.findUnique({ where: { id }, select: { slug: true } }))
    : null;

  const data = {
    title,
    slug,
    description: optionalValue(formData, "description"),
    category: optionalValue(formData, "category"),
    previewImage: optionalValue(formData, "previewImage"),
    coverImage: optionalValue(formData, "coverImage"),
    demoUrl: optionalValue(formData, "demoUrl"),
    features: featureJson(formData),
    published: publishedValue(formData),
    sortOrder: numberValue(formData, "sortOrder"),
  };

  if (id) {
    await prisma.template.update({
      where: { id },
      data,
    });
  } else {
    await prisma.template.upsert({
      where: { slug },
      create: data,
      update: data,
    });
  }

  revalidateSite([`/sablonlar/${slug}`, previousSlug ? `/sablonlar/${previousSlug}` : null]);
}

export async function deleteTemplateAction(formData: FormData) {
  await requireAdmin();

  const id = optionalValue(formData, "id");
  const slug = optionalValue(formData, "slug");

  const currentSlug = await findRecordSlug(
    () =>
      id
        ? prisma.template.findUnique({ where: { id }, select: { slug: true } })
        : prisma.template.findUnique({ where: { slug: slug ?? "" }, select: { slug: true } }),
    slug
  );

  if (id) {
    await prisma.template.delete({ where: { id } }).catch(() => null);
  } else if (slug) {
    await prisma.template.delete({ where: { slug } }).catch(() => null);
  }

  revalidateSite([currentSlug ? `/sablonlar/${currentSlug}` : null]);
}

export async function saveBlogPostAction(formData: FormData) {
  await requireAdmin();

  const id = optionalValue(formData, "id");
  const title = value(formData, "title");
  const slug = normalizeSlug(value(formData, "slug"), title);

  if (!title || !slug) return;

  const previousPost = id
    ? await prisma.blogPost.findUnique({
        where: { id },
        select: { slug: true, publishedAt: true },
      })
    : null;

  const published = publishedValue(formData);
  const explicitDate = dateValue(formData, "publishedAt");
  const publishedAt =
    explicitDate ?? previousPost?.publishedAt ?? (published ? new Date() : null);

  const data = {
    title,
    slug,
    summary: optionalValue(formData, "summary"),
    content: nullableJsonValue(optionalValue(formData, "content")),
    category: optionalValue(formData, "category"),
    tags: tagsJson(formData, "tags"),
    coverImage: optionalValue(formData, "coverImage"),
    author: optionalValue(formData, "author"),
    readTime: numberValue(formData, "readTime", 5),
    featured: boolValue(formData, "featured"),
    published,
    publishedAt,
  };

  if (id) {
    await prisma.blogPost.update({
      where: { id },
      data,
    });
  } else {
    await prisma.blogPost.upsert({
      where: { slug },
      create: data,
      update: data,
    });
  }

  revalidateSite([`/blog/${slug}`, previousPost?.slug ? `/blog/${previousPost.slug}` : null]);
}

export async function deleteBlogPostAction(formData: FormData) {
  await requireAdmin();

  const id = optionalValue(formData, "id");
  const slug = optionalValue(formData, "slug");

  const currentSlug = await findRecordSlug(
    () =>
      id
        ? prisma.blogPost.findUnique({ where: { id }, select: { slug: true } })
        : prisma.blogPost.findUnique({ where: { slug: slug ?? "" }, select: { slug: true } }),
    slug
  );

  if (id) {
    await prisma.blogPost.delete({ where: { id } }).catch(() => null);
  } else if (slug) {
    await prisma.blogPost.delete({ where: { slug } }).catch(() => null);
  }

  revalidateSite([currentSlug ? `/blog/${currentSlug}` : null]);
}

export async function updateLeadStatusAction(formData: FormData) {
  await requireAdmin();

  const id = value(formData, "id");
  const status = value(formData, "status") as "NEW" | "READ" | "ARCHIVED";
  if (!id || !["NEW", "READ", "ARCHIVED"].includes(status)) return;

  await prisma.lead.update({
    where: { id },
    data: { status },
  });

  revalidateRoutes(["/admin/messages", "/admin"]);
}

export async function deleteLeadAction(formData: FormData) {
  await requireAdmin();

  const id = value(formData, "id");
  if (id) {
    await prisma.lead.delete({ where: { id } }).catch(() => null);
  }

  revalidateRoutes(["/admin/messages", "/admin"]);
}

export async function saveGlobalSettingsAction(formData: FormData) {
  await requireAdmin();

  await prisma.siteSetting.upsert({
    where: { key: "global" },
    create: {
      key: "global",
      value: {
        site_name: value(formData, "site_name"),
        seo_default_title: value(formData, "seo_default_title"),
        seo_default_description: value(formData, "seo_default_description"),
        footer_description: value(formData, "footer_description"),
        footer_email: value(formData, "footer_email"),
        footer_phone: value(formData, "footer_phone"),
      },
    },
    update: {
      value: {
        site_name: value(formData, "site_name"),
        seo_default_title: value(formData, "seo_default_title"),
        seo_default_description: value(formData, "seo_default_description"),
        footer_description: value(formData, "footer_description"),
        footer_email: value(formData, "footer_email"),
        footer_phone: value(formData, "footer_phone"),
      },
    },
  });

  revalidateSite();
}

export async function saveHomeSettingsAction(formData: FormData) {
  await requireAdmin();

  const previous = await prisma.siteSetting.findUnique({
    where: { key: "home" },
    select: { value: true },
  });
  const nextValue = objectValue(previous?.value);

  [
    "hero_badge",
    "hero_heading",
    "hero_subheading",
    "hero_cta_primary_label",
    "hero_cta_primary_url",
    "hero_cta_secondary_label",
    "hero_cta_secondary_url",
    "trusted_brands_heading",
    "products_section_heading",
    "products_section_description",
    "solutions_section_heading",
    "solutions_section_description",
    "work_section_heading",
    "work_section_description",
    "work_section_button_label",
    "work_section_button_url",
    "why_macework_heading",
    "why_macework_description",
    "why_macework_visual_mode",
    "why_macework_card_title",
    "why_macework_card_subtitle",
    "process_section_heading",
    "lead_section_heading",
    "lead_section_description",
    "lead_button_label",
  ].forEach((key) => assignTextIfPresent(nextValue, formData, key));

  if (formData.has("trusted_brands_logo_urls")) {
    nextValue.trusted_brands_logos = trustedLogosJson(formData);
  }

  if (formData.has("featured_product_slugs")) {
    nextValue.featured_product_slugs = multiValues(formData, "featured_product_slugs");
  }

  if (formData.has("featured_solution_slugs")) {
    nextValue.featured_solution_slugs = multiValues(formData, "featured_solution_slugs");
  }

  if (formData.has("featured_project_slugs")) {
    nextValue.featured_project_slugs = multiValues(formData, "featured_project_slugs");
  }

  if (formData.has("why_feature_title_0")) {
    nextValue.why_macework_features = whyFeatureJson(formData);
  }

  if (formData.has("why_macework_image_url")) {
    const imageUrl = optionalValue(formData, "why_macework_image_url");
    nextValue.why_macework_image = imageUrl ? { url: imageUrl } : null;
  }

  if (formData.has("why_macework_card_items")) {
    nextValue.why_macework_card_items = textPairs(value(formData, "why_macework_card_items"));
  }

  if (formData.has("process_step_title_0")) {
    nextValue.process_steps = processStepJson(formData);
  }

  await prisma.siteSetting.upsert({
    where: { key: "home" },
    create: {
      key: "home",
      value: nextValue,
    },
    update: {
      value: nextValue,
    },
  });

  revalidateSite(["/admin/pages", "/admin/pages/home"]);
}

export async function saveProjectsPageSettingsAction(formData: FormData) {
  await requireAdmin();

  const nextValue = await settingObjectForKey("projects_page");
  [
    "eyebrow",
    "heading",
    "description",
    "cta_heading",
    "cta_description",
    "cta_button_label",
    "cta_button_url",
  ].forEach((key) => assignTextIfPresent(nextValue, formData, key));

  await upsertSettingObject("projects_page", nextValue);

  revalidateSite(["/islerimiz", "/admin/pages", "/admin/pages/islerimiz"]);
}

export async function saveBlogPageSettingsAction(formData: FormData) {
  await requireAdmin();

  const nextValue = await settingObjectForKey("blog_page");
  ["eyebrow", "heading", "description"].forEach((key) =>
    assignTextIfPresent(nextValue, formData, key)
  );

  await upsertSettingObject("blog_page", nextValue);

  revalidateSite(["/blog", "/admin/pages", "/admin/pages/blog"]);
}

export async function saveTemplatesPageSettingsAction(formData: FormData) {
  await requireAdmin();

  const nextValue = await settingObjectForKey("templates_page");
  [
    "eyebrow",
    "heading",
    "description",
    "cta_heading",
    "cta_description",
    "cta_button_label",
    "cta_button_url",
  ].forEach((key) => assignTextIfPresent(nextValue, formData, key));

  await upsertSettingObject("templates_page", nextValue);

  revalidateSite(["/sablonlar", "/admin/pages", "/admin/pages/sablonlar"]);
}

export async function saveAboutSettingsAction(formData: FormData) {
  await requireAdmin();

  const nextValue = await settingObjectForKey("about");
  [
    "eyebrow",
    "heading",
    "about_description",
    "story_heading",
    "story",
    "mission_heading",
    "mission",
    "vision_heading",
    "vision",
    "about_visual_mode",
    "team_heading",
    "team_description",
    "cta_heading",
    "cta_description",
    "cta_button_label",
    "cta_button_url",
  ].forEach((key) => assignTextIfPresent(nextValue, formData, key));

  if (formData.has("about_image_url")) {
    const imageUrl = optionalValue(formData, "about_image_url");
    nextValue.about_image = imageUrl ? { url: imageUrl } : null;
  }

  if (formData.has("stat_label_0")) {
    nextValue.stats = aboutStatsJson(formData);
  }

  await upsertSettingObject("about", nextValue);

  revalidateSite(["/hakkimizda", "/admin/pages", "/admin/pages/hakkimizda"]);
}

export async function saveTeamMemberAction(formData: FormData) {
  await requireAdmin();

  const id = optionalValue(formData, "id");
  const name = value(formData, "name");
  const role = value(formData, "role");

  if (!name || !role) return;

  const data = {
    name,
    role,
    bio: optionalValue(formData, "bio"),
    image: optionalValue(formData, "image"),
    sortOrder: numberValue(formData, "sortOrder"),
    published: boolValue(formData, "published"),
  };

  if (id) {
    await prisma.teamMember.update({ where: { id }, data });
  } else {
    await prisma.teamMember.create({ data });
  }

  revalidateSite(["/hakkimizda", "/admin/pages/hakkimizda"]);
}

export async function deleteTeamMemberAction(formData: FormData) {
  await requireAdmin();

  const id = optionalValue(formData, "id");
  if (!id) return;

  await prisma.teamMember.delete({ where: { id } }).catch(() => null);

  revalidateSite(["/hakkimizda", "/admin/pages/hakkimizda"]);
}

export async function saveHeaderSettingsAction(formData: FormData) {
  await requireAdmin();

  const navigation = sortedByOrder(
    Array.from({ length: 6 }, (_, index) => ({
      label: value(formData, `nav_label_${index}`),
      href: value(formData, `nav_href_${index}`),
      target: value(formData, `nav_target_${index}`) || "_self",
      type: value(formData, `nav_type_${index}`) || "link",
      published: publishedSelect(formData, `nav_published_${index}`),
      sortOrder: numberValue(formData, `nav_sort_${index}`, index),
    })).filter((item) => item.label && item.href)
  );

  const megaMenuColumns = Array.from({ length: 3 }, (_, columnIndex) => ({
    title: value(formData, `mega_column_title_${columnIndex}`),
    items: sortedByOrder(
      Array.from({ length: 4 }, (_, itemIndex) => ({
        title: value(formData, `mega_item_title_${columnIndex}_${itemIndex}`),
        description: value(formData, `mega_item_description_${columnIndex}_${itemIndex}`),
        icon: value(formData, `mega_item_icon_${columnIndex}_${itemIndex}`) || "code",
        href: value(formData, `mega_item_href_${columnIndex}_${itemIndex}`),
        published: publishedSelect(
          formData,
          `mega_item_published_${columnIndex}_${itemIndex}`
        ),
        sortOrder: numberValue(formData, `mega_item_sort_${columnIndex}_${itemIndex}`, itemIndex),
      })).filter((item) => item.title && item.href)
    ),
  })).filter((column) => column.title || column.items.length);

  await upsertSettingObject("header", {
    logo_text: value(formData, "logo_text"),
    navigation,
    cta_label: value(formData, "cta_label"),
    cta_href: value(formData, "cta_href"),
    mega_menu_label: value(formData, "mega_menu_label"),
    mega_menu_columns: megaMenuColumns,
  });

  revalidateSite(["/admin/pages", "/admin/pages/header"]);
}

export async function saveFooterSettingsAction(formData: FormData) {
  await requireAdmin();

  const quickLinks = sortedByOrder(
    Array.from({ length: 6 }, (_, index) => ({
      label: value(formData, `quick_label_${index}`),
      href: value(formData, `quick_href_${index}`),
      target: value(formData, `quick_target_${index}`) || "_self",
      published: publishedSelect(formData, `quick_published_${index}`),
      sortOrder: numberValue(formData, `quick_sort_${index}`, index),
    })).filter((item) => item.label && item.href)
  );

  const socialLinks = sortedByOrder(
    Array.from({ length: 5 }, (_, index) => ({
      platform: value(formData, `social_platform_${index}`),
      url: value(formData, `social_url_${index}`),
      icon: value(formData, `social_icon_${index}`),
      published: publishedSelect(formData, `social_published_${index}`),
      sortOrder: numberValue(formData, `social_sort_${index}`, index),
    })).filter((item) => item.platform && item.url)
  );

  const legalLinks = sortedByOrder(
    Array.from({ length: 4 }, (_, index) => ({
      label: value(formData, `legal_label_${index}`),
      href: value(formData, `legal_href_${index}`),
      published: publishedSelect(formData, `legal_published_${index}`),
      sortOrder: numberValue(formData, `legal_sort_${index}`, index),
    })).filter((item) => item.label && item.href)
  );

  await upsertSettingObject("footer", {
    logo_text: value(formData, "logo_text"),
    description: value(formData, "description"),
    quick_links_heading: value(formData, "quick_links_heading"),
    quick_links: quickLinks,
    contact_heading: value(formData, "contact_heading"),
    email: value(formData, "email"),
    phone: value(formData, "phone"),
    address: value(formData, "address"),
    social_links: socialLinks,
    legal_links: legalLinks,
    copyright: value(formData, "copyright"),
  });

  revalidateSite(["/admin/pages", "/admin/pages/footer"]);
}

export async function saveContactSettingsAction(formData: FormData) {
  await requireAdmin();

  const nextValue = await settingObjectForKey("contact");
  [
    "eyebrow",
    "heading",
    "subheading",
    "info_heading",
    "info_description",
    "phone_label",
    "phone",
    "email_label",
    "email",
    "address_label",
    "address",
    "whatsapp_number",
    "whatsapp_intro",
    "whatsapp_text",
    "form_heading",
    "form_subheading",
    "form_placeholder_name",
    "form_placeholder_company",
    "form_placeholder_email",
    "form_placeholder_message",
    "form_button_text",
    "trusted_brands_heading",
  ].forEach((key) => assignTextIfPresent(nextValue, formData, key));

  await prisma.siteSetting.upsert({
    where: { key: "contact" },
    create: {
      key: "contact",
      value: nextValue,
    },
    update: {
      value: nextValue,
    },
  });

  revalidateSite(["/iletisim", "/admin/pages", "/admin/pages/iletisim"]);
}

export async function deleteMediaAction(formData: FormData) {
  await requireAdmin();

  const id = value(formData, "id");
  const url = value(formData, "url");
  if (!id) return;

  await prisma.mediaFile.delete({ where: { id } }).catch(() => null);

  if (url.startsWith("/uploads/")) {
    const target = path.join(process.cwd(), "public", url);
    await unlink(target).catch(() => null);
  }

  revalidateRoutes(["/admin/media"]);
}

export async function seedDefaultContentAction() {
  await requireAdmin();

  await Promise.all(
    siteContent.products.items.map((product, index) =>
      prisma.product.upsert({
        where: { slug: product.slug },
        create: {
          title: product.title,
          slug: product.slug,
          description: product.description,
          longDescription: product.longDescription,
          badge: product.badge,
          tag: product.category,
          category: product.category,
          version: "1.0.0",
          platformType: "SaaS",
          platformUrl: product.href,
          features: product.features.map((title) => ({ title })),
          published: true,
          sortOrder: index,
        },
        update: {},
      })
    )
  );

  await Promise.all(
    siteContent.solutionsDetail.map((solution, index) =>
      prisma.solution.upsert({
        where: { slug: solution.slug },
        create: {
          title: solution.title,
          slug: solution.slug,
          badgeText: "Çözümlerimiz",
          shortDescription: solution.description,
          description: solution.description,
          icon: "Code",
          features: solution.features.map((title) => ({ title })),
          published: true,
          sortOrder: index,
        },
        update: {},
      })
    )
  );

  await Promise.all(
    siteContent.works.items.map((project, index) =>
      prisma.project.upsert({
        where: { slug: project.slug },
        create: {
          title: project.title,
          slug: project.slug,
          description: project.description,
          longDescription: project.longDescription,
          category: project.category,
          year: project.year,
          coverImage: project.gallery?.[0] ?? null,
          gallery: project.gallery ?? [],
          tags: project.technologies ?? [],
          featured: index < 3,
          published: true,
          sortOrder: index,
        },
        update: {},
      })
    )
  );

  await Promise.all(
    siteContent.blog.items.map((post, index) =>
      prisma.blogPost.upsert({
        where: { slug: post.slug },
        create: {
          title: post.title,
          slug: post.slug,
          summary: post.excerpt,
          content: post.content,
          category: post.category,
          author: post.author,
          readTime: Number.parseInt(post.readTime, 10) || 5,
          published: true,
          publishedAt: new Date(2026, 2, 18 + index),
        },
        update: {},
      })
    )
  );

  await Promise.all(
    siteContent.templates.items.map((template, index) =>
      prisma.template.upsert({
        where: { slug: template.id },
        create: {
          title: template.title,
          slug: template.id,
          category: template.category,
          previewImage: template.image,
          coverImage: template.image,
          demoUrl: template.href,
          features: ["Yüksek Performans", "Mobil Uyumlu", "SEO Odaklı"].map((title) => ({
            title,
          })),
          published: true,
          sortOrder: index,
        },
        update: {},
      })
    )
  );

  revalidateSite();
}
