const fs = require('fs');
const path = require('path');

const authViewPath = path.join(__dirname, 'src', 'components', 'AuthView.jsx');

if (!fs.existsSync(authViewPath)) {
    console.error(`Could not find file: ${authViewPath}`);
    process.exit(1);
}

let text = fs.readFileSync(authViewPath, 'utf8');

const oldRenderBlock = `          if (window.google?.accounts?.id && btnRef.current) {
            window.google.accounts.id.initialize({
              client_id: '682818593798-cl4hutmj3gbj0cje8i7ndrs82oecuo3o.apps.googleusercontent.com',
              callback: handleCredentialResponse,
              auto_select: false,
              cancel_on_tap_outside: true,
              log_level: 'info'
            });

            btnRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(btnRef.current, {
              theme: 'filled_blue',
              size: 'large',
              shape: 'pill',
              width: 280,
              text: 'continue_with'
            });

            setIsScriptLoaded(true);
            setInitError(null);

            window.google.accounts.id.prompt((notification) => {
              if (notification.isNotDisplayed()) {
                console.log('One Tap not displayed:', notification.getNotDisplayedReason());
              }
            });

            console.log('✅ Google Sign-In Button Rendered');
            return;
          }`;

const newRenderBlock = `          const googleButtonParent = btnRef.current || document.getElementById('google-signin-btn');

          if (window.google?.accounts?.id && googleButtonParent) {
            window.google.accounts.id.initialize({
              client_id: '682818593798-cl4hutmj3gbj0cje8i7ndrs82oecuo3o.apps.googleusercontent.com',
              callback: handleCredentialResponse,
              auto_select: false,
              cancel_on_tap_outside: true
            });

            googleButtonParent.innerHTML = '';

            window.google.accounts.id.renderButton(googleButtonParent, {
              theme: 'filled_blue',
              size: 'large',
              shape: 'pill',
              width: 280,
              text: 'continue_with'
            });

            setIsScriptLoaded(true);
            setInitError(null);

            console.log('✅ Google Sign-In Button Rendered');
            return;
          }`;

const oldButtonDiv = `              <div id="google-signin-btn" ref={btnRef}></div>`;

const newButtonDiv = `              <div
                id="google-signin-btn"
                ref={btnRef}
                style={{
                  minHeight: '44px',
                  width: '280px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              ></div>`;

let changed = false;

if (text.includes(oldRenderBlock)) {
    text = text.replace(oldRenderBlock, newRenderBlock);
    changed = true;
    console.log('Updated Google render block.');
} else {
    console.warn('Could not find the exact old Google render block. It may already be changed or different.');
}

if (text.includes(oldButtonDiv)) {
    text = text.replace(oldButtonDiv, newButtonDiv);
    changed = true;
    console.log('Updated Google button container.');
} else {
    console.warn('Could not find the exact old Google button div. It may already be changed or different.');
}

if (!changed) {
    console.error('No changes were made.');
    process.exit(1);
}

fs.writeFileSync(authViewPath, text, 'utf8');

console.log('Done. AuthView.jsx was patched successfully.');
