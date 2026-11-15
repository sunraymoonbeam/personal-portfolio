# Security

## Reporting a problem

If you find a security problem on [renhwa.com](https://renhwa.com), please
email me at zack.low.dev@gmail.com. Don't open a public issue: I'd like to fix it before
anyone else can use it.

Tell me the URL, the steps to reproduce it, and what someone could do with it.
I'll reply as soon as I can. This is a personal site, so there's no bug bounty.

## For reviewers

What matters most in this repo:

- **No secrets.** Nothing in the repo or the build may hold a key, token or
  password. `.env` files stay out of git.
- **The contact form.** It has no backend: `src/scripts/contact.ts` builds a
  `mailto:` link. The form stays `hidden` until that script binds, so it can
  never submit by GET and put its fields in the URL.
- **nginx headers.** nginx drops server-level `add_header` in any location
  that sets its own, so every location in `nginx.conf` repeats the security
  headers. A new location must too.
