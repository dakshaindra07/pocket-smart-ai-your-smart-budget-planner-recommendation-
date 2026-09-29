(() => {
  const toast = document.querySelector('[data-toast]');
  let toastTimer;
  const showToast = (message, isError = false) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle('toast-error', isError);
    toast.classList.add('toast-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('toast-visible'), 4200);
  };
  const formatMoney = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(value) || 0);
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  };
  const sectionTitle = (eyebrow, title) => {
    const heading = element('div', 'result-section-heading');
    heading.append(element('p', 'eyebrow', eyebrow), element('h3', '', title));
    return heading;
  };
  const makeResult = (result, planType) => {
    const wrapper = element('div', 'result-content');
    const summary = element('div', 'budget-summary');
    const total = element('div', 'summary-number');
    total.append(element('span', '', 'TOTAL BUDGET'), element('strong', '', formatMoney(result.total_budget)));
    const remaining = element('div', 'summary-number summary-remaining');
    remaining.append(element('span', '', 'LEFT TO ALLOCATE'), element('strong', '', formatMoney(result.remaining_budget)));
    const source = element('span', `source-badge${result.source === 'Gemini' ? ' source-ai' : ''}`, result.source === 'Gemini' ? '✳ GEMINI' : 'BUDGET-SAFE PLAN');
    summary.append(total, element('span', 'summary-divider', '−'), remaining, source);
    wrapper.append(summary);

    if (result.outfit_analysis) {
      const analysis = element('section', 'outfit-analysis');
      analysis.append(sectionTitle('OUTFIT NOTES', 'Matched to your look'));
      const colors = Array.isArray(result.outfit_analysis.colors) ? result.outfit_analysis.colors.join(', ') : '';
      const analysisGrid = element('div', 'analysis-grid');
      [['Colors', colors], ['Style', result.outfit_analysis.style], ['Formality', result.outfit_analysis.formality]].forEach(([label, value]) => {
        const item = element('div', 'analysis-item');
        item.append(element('span', '', label), element('b', '', value || '—'));
        analysisGrid.append(item);
      });
      analysis.append(analysisGrid);
      wrapper.append(analysis);
    }

    if (Array.isArray(result.budget_breakdown)) {
      wrapper.append(sectionTitle('YOUR BREAKDOWN', 'Every rupee has a role'));
      const cards = element('div', 'result-categories');
      result.budget_breakdown.forEach((category) => {
        const card = element('article', 'result-category');
        const head = element('div', 'category-result-heading');
        head.append(element('div', '', category.category || 'Plan'), element('strong', '', formatMoney(category.allocation)));
        card.append(head);
        const items = Array.isArray(category.items) ? category.items : [];
        if (items.length) {
          const tableWrap = element('div', 'result-table-wrap');
          const table = element('table', 'result-table');
          const thead = document.createElement('thead');
          const headerRow = document.createElement('tr');
          ['Item', 'Description', 'Price', 'Qty.', 'Shop'].forEach((heading) => headerRow.append(element('th', '', heading)));
          thead.append(headerRow);
          const tbody = document.createElement('tbody');
          items.forEach((item) => {
            const row = document.createElement('tr');
            row.append(element('th', 'item-name', item.name || 'Suggested item'), element('td', 'item-description', item.description || ''), element('td', 'item-price', formatMoney(item.estimated_price)), element('td', 'item-quantity', item.quantity ?? 1));
            const linkCell = document.createElement('td');
            linkCell.className = 'shopping-links';
            Object.entries(item.shopping_links || {}).forEach(([name, url]) => {
              try {
                const parsed = new URL(url);
                if (!['https:', 'http:'].includes(parsed.protocol)) return;
                const link = element('a', 'shop-link', name);
                link.href = parsed.href;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                linkCell.append(link);
              } catch { /* Ignore malformed links from model output. */ }
            });
            row.append(linkCell);
            tbody.append(row);
          });
          table.append(thead, tbody);
          tableWrap.append(table);
          card.append(tableWrap);
        }
        cards.append(card);
      });
      wrapper.append(cards);
    }

    if (Array.isArray(result.jewelry_recommendations)) {
      wrapper.append(sectionTitle('A FEW GOOD MATCHES', 'Jewelry to consider'));
      const cards = element('div', 'result-categories jewelry-results');
      result.jewelry_recommendations.forEach((item) => {
        const card = element('article', 'result-category jewelry-result');
        const head = element('div', 'category-result-heading');
        head.append(element('div', '', item.item_type || 'Jewelry'), element('strong', '', formatMoney(item.estimated_price)));
        card.append(head, element('p', 'jewelry-description', item.description || ''), element('p', 'jewelry-style', item.style || ''));
        const links = element('div', 'shopping-links jewelry-links');
        Object.entries(item.shopping_links || {}).forEach(([name, url]) => {
          try {
            const parsed = new URL(url);
            if (!['https:', 'http:'].includes(parsed.protocol)) return;
            const link = element('a', 'shop-link', name);
            link.href = parsed.href;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            links.append(link);
          } catch { /* Ignore malformed links from model output. */ }
        });
        card.append(links);
        cards.append(card);
      });
      wrapper.append(cards);
    }

    const extras = [];
    if (Array.isArray(result.venue_suggestions) && result.venue_suggestions.length) extras.push(['VENUE IDEAS', result.venue_suggestions]);
    if (Array.isArray(result.styling_tips) && result.styling_tips.length) extras.push(['STYLING NOTES', result.styling_tips]);
    if (Array.isArray(result.additional_suggestions) && result.additional_suggestions.length) extras.push(['A FEW MORE THOUGHTS', result.additional_suggestions]);
    extras.forEach(([heading, suggestions]) => {
      const section = element('section', 'suggestions-card');
      section.append(sectionTitle(heading, planType === 'jewelry' ? 'Worth keeping in mind' : 'A little extra thought'));
      const list = document.createElement('ul');
      suggestions.forEach((suggestion) => list.append(element('li', '', suggestion)));
      section.append(list);
      wrapper.append(section);
    });
    const note = element('p', 'estimate-note', 'Prices are estimates, not live quotes. Confirm current pricing, stock, taxes and delivery with the seller.');
    wrapper.append(note);
    return wrapper;
  };

  document.querySelectorAll('[data-planner]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const results = document.querySelector('[data-results]');
      const originalText = button.textContent;
      const type = form.dataset.planner;
      const payload = new FormData(form);
      const options = { method: 'POST', headers: { Accept: 'application/json' } };
      if (type === 'jewelry') {
        options.body = payload;
      } else {
        const values = Object.fromEntries(payload.entries());
        const budget = Number(values.total_budget);
        const numericFields = type === 'home' ? ['number_of_lights', 'ceiling_fans', 'furniture_pieces', 'dining_tables'] : ['guest_count'];
        numericFields.forEach((key) => { values[key] = Number(values[key] || 0); });
        values.total_budget = budget;
        if (type === 'home') values.rooms = payload.getAll('rooms');
        if (type === 'party') {
          ['needs_catering', 'needs_decoration', 'needs_entertainment'].forEach((key) => { values[key] = payload.has(key); });
        }
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(values);
      }
      const previousError = form.querySelector('[data-form-error]');
      if (previousError) previousError.remove();
      button.disabled = true;
      button.textContent = 'Building your plan…';
      form.setAttribute('aria-busy', 'true');
      try {
        const response = await fetch(form.action, options);
        const result = await response.json();
        if (!response.ok) {
          const details = Array.isArray(result.detail) ? result.detail.map((entry) => entry.msg).join(' · ') : result.detail;
          throw new Error(details || 'We could not build this plan. Please check the details and try again.');
        }
        results.replaceChildren(makeResult(result, type));
        results.hidden = false;
        results.setAttribute('tabindex', '-1');
        results.focus({ preventScroll: true });
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast('Your plan is saved to history.');
      } catch (error) {
        const message = element('div', 'form-error planner-error', error.message || 'Something went wrong. Please try again.');
        message.setAttribute('role', 'alert');
        form.prepend(message);
        showToast('Your plan could not be built.', true);
      } finally {
        button.disabled = false;
        button.textContent = originalText;
        form.removeAttribute('aria-busy');
      }
    });
  });

  document.querySelectorAll('[data-auth-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const errorBox = form.querySelector('[data-form-error]');
      const originalText = button.textContent;
      errorBox.hidden = true;
      button.disabled = true;
      button.textContent = form.dataset.authForm === 'login' ? 'Signing in…' : 'Creating your account…';
      try {
        const body = Object.fromEntries(new FormData(form).entries());
        if (form.dataset.authForm === 'login') {
          const response = await fetch('/token', { method: 'POST', headers: { Accept: 'application/json' }, body: new URLSearchParams(new FormData(form)) });
          const result = await response.json();
          if (!response.ok) throw new Error(result.detail || 'Sign-in failed. Check your username and password.');
          const next = new URLSearchParams(window.location.search).get('next');
          const destination = next ? new URL(next, window.location.origin) : null;
          const target = destination?.origin === window.location.origin ? `${destination.pathname}${destination.search}${destination.hash}` : '/dashboard';
          window.location.assign(target);
        } else {
          const response = await fetch('/register', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
          const result = await response.json();
          if (!response.ok) throw new Error(result.detail || 'We could not create your account. Check the details and try again.');
          const next = new URLSearchParams(window.location.search).get('next');
          const loginUrl = new URL('/login', window.location.origin);
          loginUrl.searchParams.set('registered', '1');
          if (next) loginUrl.searchParams.set('next', next);
          window.location.assign(`${loginUrl.pathname}${loginUrl.search}`);
        }
      } catch (error) {
        errorBox.textContent = error.message || 'Something went wrong. Please try again.';
        errorBox.hidden = false;
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  });

  const financialProfileForm = document.querySelector('[data-financial-profile]');
  if (financialProfileForm) {
    const incomeInput = financialProfileForm.elements.monthly_net_income;
    const expensesInput = financialProfileForm.elements.monthly_essential_expenses;
    const savingsInput = financialProfileForm.elements.monthly_savings_goal;
    const profilePreview = document.querySelector('[data-profile-preview]');
    const profileExplanation = document.querySelector('[data-profile-explanation]');
    const updatePreview = () => {
      const income = Number(incomeInput.value) || 0;
      const expenses = Number(expensesInput.value) || 0;
      const savings = Number(savingsInput.value) || 0;
      const available = Math.max(0, Math.round((income - expenses - savings) * 100) / 100);
      profilePreview.textContent = formatMoney(available);
      document.querySelector('[data-preview-income]').textContent = formatMoney(income);
      document.querySelector('[data-preview-expenses]').textContent = `− ${formatMoney(expenses)}`;
      document.querySelector('[data-preview-savings]').textContent = `− ${formatMoney(savings)}`;
      document.querySelector('[data-preview-total]').textContent = formatMoney(available);
      profileExplanation.textContent = income > 0 && expenses + savings > income
        ? 'Your expenses and savings goal exceed income. No discretionary amount is available.'
        : income > 0 ? 'After essential expenses and your monthly savings goal.' : 'Enter your income, essentials and savings goal to see your calculated amount.';
    };
    [incomeInput, expensesInput, savingsInput].forEach((input) => input.addEventListener('input', updatePreview));
    updatePreview();
    financialProfileForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = financialProfileForm.querySelector('button[type="submit"]');
      const errorBox = financialProfileForm.querySelector('[data-profile-error]');
      const originalText = submitButton.textContent;
      errorBox.hidden = true;
      submitButton.disabled = true;
      submitButton.textContent = 'Saving profile…';
      try {
        const payload = {
          monthly_net_income: Number(incomeInput.value),
          monthly_essential_expenses: Number(expensesInput.value),
          monthly_savings_goal: Number(savingsInput.value),
        };
        const response = await fetch('/financial-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.detail || 'We could not save your profile. Check the amounts and try again.');
        profilePreview.textContent = formatMoney(result.available_budget);
        document.querySelector('[data-preview-total]').textContent = formatMoney(result.available_budget);
        showToast('Budget profile saved. Your planners will use this amount.');
      } catch (error) {
        errorBox.textContent = error.message || 'Something went wrong. Please try again.';
        errorBox.hidden = false;
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });
  }

  const navigationToggle = document.querySelector('[data-nav-toggle]');
  navigationToggle?.addEventListener('click', () => {
    const open = navigationToggle.getAttribute('aria-expanded') !== 'true';
    navigationToggle.setAttribute('aria-expanded', String(open));
    document.querySelector('[data-nav]')?.classList.toggle('nav-open', open);
  });

  const imageInput = document.querySelector('#outfit-image');
  const preview = document.querySelector('[data-image-preview]');
  const previewImage = document.querySelector('[data-preview-image]');
  let previewUrl;
  imageInput?.addEventListener('change', () => {
    const file = imageInput.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      imageInput.value = '';
      showToast('Choose an image smaller than 8 MB.', true);
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    previewImage.src = previewUrl;
    document.querySelector('[data-file-name]').textContent = file.name;
    preview.hidden = false;
    document.querySelector('[data-upload-zone]').hidden = true;
  });
  document.querySelector('[data-remove-image]')?.addEventListener('click', () => {
    imageInput.value = '';
    preview.hidden = true;
    document.querySelector('[data-upload-zone]').hidden = false;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = undefined;
  });

  document.querySelectorAll('[data-details-url]').forEach((button) => {
    button.addEventListener('click', async () => {
      const panel = button.closest('.history-entry')?.querySelector('[data-history-panel]');
      if (!panel) return;
      if (!panel.hidden) {
        panel.hidden = true;
        button.setAttribute('aria-expanded', 'false');
        button.firstChild.textContent = 'View plan ';
        return;
      }
      button.disabled = true;
      button.firstChild.textContent = 'Loading…';
      try {
        const response = await fetch(button.dataset.detailsUrl, { headers: { Accept: 'application/json' } });
        const entry = await response.json();
        if (!response.ok) throw new Error(entry.detail || 'Plan details are unavailable.');
        const detail = element('div', 'history-detail-content');
        detail.append(element('p', 'eyebrow', 'PLAN INPUTS'), element('pre', '', JSON.stringify(entry.input_summary, null, 2)), element('p', 'eyebrow', 'SAVED RECOMMENDATIONS'), element('pre', '', JSON.stringify(entry.result, null, 2)));
        panel.replaceChildren(detail);
        panel.hidden = false;
        button.setAttribute('aria-expanded', 'true');
        button.firstChild.textContent = 'Hide plan ';
      } catch (error) {
        showToast(error.message, true);
        button.firstChild.textContent = 'View plan ';
      } finally {
        button.disabled = false;
      }
    });
  });
})();
