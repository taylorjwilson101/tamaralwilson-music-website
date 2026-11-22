# tamaralwilson-music-website

This is the repo that stores my attempt to create a free version of my Mom's website.

The site for singer/songwriter **Tamara L. Wilson**, rebuilt from the old GoDaddy Website
Builder site as a static site that **GitHub Pages** builds and hosts.
The only cost left is the yearly renewal of the domain name.

## Publish it (one time)

GitHub Pages is free for **public** repos. A private repo needs GitHub Pro (about $4/month).
To make the repo public: **Settings → General → Danger Zone → Change visibility**.

1. In the repo, open **Settings → Pages**.
2. Under **Build and deployment**, set *Source* to **Deploy from a branch**,
   choose branch **main** and folder **/ (root)**, then click **Save**.
3. After a minute or two the site is live at
   https://taylorjwilson101.github.io/tamaralwilson-music-website/

### Point tamaralwilson.com at it

1. In `_config.yml`, set `url: "https://tamaralwilson.com"` and `baseurl: ""`, then commit.
2. In **Settings → Pages → Custom domain**, enter `tamaralwilson.com` and save.
3. At GoDaddy, open the DNS settings for tamaralwilson.com:
   - Remove the existing `A` records for `@` and add four `A` records for `@`:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Set the `CNAME` record for `www` to `taylorjwilson101.github.io`
   - Leave any email (MX) records alone.
4. Once DNS updates (minutes to a few hours), tick **Enforce HTTPS** in Settings → Pages.
5. When the new site loads at tamaralwilson.com, cancel the GoDaddy **Website Builder** plan.
   **Keep the domain registration**, and turn on auto-renew.

## Editing the site

You can edit everything in the browser on GitHub: open a file, click the pencil icon, then **Commit changes**.
GitHub rebuilds the site about a minute after each change.

| To change… | Edit this file |
|---|---|
| Albums, EPs, singles, videos, track lists, credits | `_data/releases.yml` |
| Interviews, outreach video, free MP3 downloads | `_data/about.yml` |
| Home page | `index.html` |
| Watch page (all videos, built automatically from the albums) | `watch.html` |
| Bio, musician photos | `about.html`, `_data/about.yml` |
| Connect (contact) page | `connect.html` |
| Site name, YouTube/Jango/HearNow links, contact form | `_config.yml` |
| Colors and fonts | `assets/css/style.css` (the variables at the top: orange, plum, cream) |
| Big homepage picture | `images/hero-pop-collection.jpg` |

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
Until that's set, the Connect page shows `contact_email` (if filled in), or else links to YouTube and Jango.

## Preview locally (optional)

```bash
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000.
