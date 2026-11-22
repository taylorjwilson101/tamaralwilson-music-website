# tamaralwilson-music-website

This is the repo that stores my attempt to create a free version of my Mom's website.

The site for singer/songwriter **Tamara L. Wilson**, rebuilt from the old GoDaddy Website
Builder site as a free static site. This repo is private, so the site is built and hosted
for free by **Cloudflare Pages**, which can deploy from private GitHub repos.
The only cost left is the yearly renewal of the domain name.

## Publish it (one time)

1. Create a free account at https://dash.cloudflare.com/sign-up.
2. In the dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**.
   Connect GitHub and allow access to the `tamaralwilson-music-website` repo only.
3. Pick the repo and use these build settings:
   - **Production branch:** `main`
   - **Framework preset:** Jekyll
   - **Build command:** `bundle exec jekyll build`
   - **Build output directory:** `_site`
   - Under **Environment variables**, add `RUBY_VERSION` = `3.3.6`
4. Click **Save and Deploy**. After a couple of minutes the site is live at
   `https://<project-name>.pages.dev`. Check it there before moving the domain.

### Point tamaralwilson.com at it

The simplest route is to let Cloudflare run the domain's DNS (free):

1. In Cloudflare, **Add a domain**: enter `tamaralwilson.com` and pick the **Free** plan.
   Cloudflare copies the existing DNS records and gives you two nameservers.
2. At GoDaddy, open **My Products → tamaralwilson.com → DNS → Nameservers → Change**,
   choose "I'll use my own nameservers" and enter the two Cloudflare nameservers.
   **If the domain has email (e.g. MX records), check that Cloudflare copied those records before you switch.**
3. In your Pages project, open **Custom domains → Set up a custom domain** and add both
   `tamaralwilson.com` and `www.tamaralwilson.com`. Cloudflare creates the records and the HTTPS certificate.
4. When the new site loads at tamaralwilson.com, cancel the GoDaddy **Website Builder** plan.
   **Keep the domain registration**, and turn on auto-renew.

## Editing the site

You can edit everything in the browser on GitHub: open a file, click the pencil icon, then **Commit changes**.
Cloudflare rebuilds the site about two minutes after each change.

| To change… | Edit this file |
|---|---|
| Albums, EPs, singles, videos, track lists, credits | `_data/releases.yml` |
| Interviews, outreach video, free MP3 downloads | `_data/about.yml` |
| Home page | `index.html` |
| Bio | `about.html` |
| Site name, YouTube/Jango/HearNow links, contact form | `_config.yml` |
| Colors and fonts | `assets/css/style.css` (the variables at the top) |

**Adding a video:** copy an existing `- id:` block in `_data/releases.yml` and swap in the
YouTube id: the 11 characters after `watch?v=` in the video's address.

**Adding a new album page:** add a new entry to `_data/releases.yml`, then create a file such as
`new-album.html` containing:

```
---
layout: release
release: new-album
title: "New Album"
permalink: /new-album
---
```

Images go in `images/`, and MP3s go in `audio/`.

## Contact form

A static site can't send email by itself, so the form uses [Formspree](https://formspree.io) (free tier: 50 messages a month).
Create a form there, then put its ID in `formspree_id` in `_config.yml`.
Until that's set, the contact page shows `contact_email` (if filled in), or else links to YouTube and Jango.

## Preview locally (optional)

```bash
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000.
