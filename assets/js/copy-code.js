// Add copy buttons to all code blocks
document.addEventListener('DOMContentLoaded', () => {
  const codeBlocks = document.querySelectorAll('.highlight pre, pre:not(.highlight pre)');
  
  codeBlocks.forEach((pre) => {
    // Create wrapper if not already wrapped
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    
    // Create copy button
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.setAttribute('aria-label', 'Copy code');
    button.innerHTML = `
      <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    
    wrapper.appendChild(button);
    
    button.addEventListener('click', async () => {
      const code = pre.querySelector('code') || pre;
      const text = code.textContent;
      
      try {
        await navigator.clipboard.writeText(text);
        button.classList.add('copied');
        
        setTimeout(() => {
          button.classList.remove('copied');
        }, 1000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });
});

