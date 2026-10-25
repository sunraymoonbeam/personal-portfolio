/**
 * The contact page: the Copy button and the form, which opens a mail draft.
 *
 * Runs on every `astro:page-load`, because the router swaps in a new DOM and a
 * page `<script>` would bind only the first one. The previous page's listeners
 * are dropped through the AbortController. The form starts `hidden` and is
 * shown only once its submit handler exists: a form with no handler would
 * submit by GET and put the message in the URL. Without JavaScript, the
 * visible mailto link is the whole story.
 */
let bindings: AbortController | null = null;
let copyTimer: number | undefined;

export function initContact() {
  bindings?.abort();
  window.clearTimeout(copyTimer);
  bindings = new AbortController();
  const { signal } = bindings;

  const btn = document.querySelector<HTMLButtonElement>('[data-copy]');
  if (btn && navigator.clipboard) {
    const label = btn.querySelector<HTMLElement>('[data-copy-label]');
    const status = document.querySelector<HTMLElement>('[data-copy-status]');
    if (label && status) {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(btn.dataset.copy ?? '');
          if (signal.aborted) return;
          btn.dataset.done = '';
          label.textContent = 'Copied';
          status.textContent = 'Email address copied.';
          window.clearTimeout(copyTimer);
          copyTimer = window.setTimeout(() => {
            delete btn.dataset.done;
            label.textContent = 'Copy';
            status.textContent = '';
          }, 2000);
        } catch {
          if (!signal.aborted) label.textContent = 'Press ⌘C';
        }
      }, { signal });
      btn.hidden = false;
    }
  }

  const form = document.querySelector<HTMLFormElement>('[data-contact]');
  const status = form?.querySelector<HTMLElement>('[data-status]');
  const address = form?.dataset.address;
  if (!form || !status || !address) return;

  const show = (id: string, message: string) => {
    const error = form.querySelector<HTMLElement>(`#err-${id}`);
    const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`);
    if (!error || !input) return;
    error.textContent = message;
    error.hidden = !message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    input.setAttribute('aria-describedby', message ? `err-${id}` : '');
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const value = (key: string) => {
      const item = data.get(key);
      return typeof item === 'string' ? item.trim() : '';
    };
    const name = value('name');
    const email = value('email');
    const message = value('message');
    show('name', name ? '' : 'What should I call you?');
    show('email', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? '' : 'Enter a valid email so I can reply.');
    show('message', message ? '' : 'Add a line or two.');
    const firstBad = form.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (firstBad) { status.textContent = ''; firstBad.focus(); return; }
    // Honeypot tripped: say nothing happened, and do nothing.
    if (value('company')) { status.textContent = 'Thanks.'; return; }
    const body = `${message}\n\n--\n${name}\n${email}`;
    window.location.href = `mailto:${address}?subject=${encodeURIComponent('Hello from ' + name)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Opening your mail app.';
  }, { signal });

  // Reveal only after submit interception exists, so failure cannot trigger a GET.
  form.hidden = false;
}
