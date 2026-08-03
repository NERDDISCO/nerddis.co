/**
 * Controls shell for the fxhash pieces that expose features instead of params
 * (nd-fxhashturnsone-001, nd-landscape-001)
 *
 * The artwork (artwork.html) is the untouched token: it reads its hash from the
 * URL and writes what that hash rolled into window.$fxhashFeatures. This shell
 * owns the hash, reloads the token when it changes and lists the features.
 */

const ALPHABET = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

// Features that only repeat what the shell already shows
const HIDDEN_FEATURES = ["name", "hash", "artist", "web"];

const artwork = document.querySelector("#nd-artwork");
const features = document.querySelector("#nd-features");
const loading = document.querySelector("#nd-loading");
const hashOutput = document.querySelector("#nd-hash");

const search = new URLSearchParams(window.location.search);

let hash = search.get("fxhash") || randomHash();

function randomHash() {
  return (
    "oo" +
    Array(49)
      .fill(0)
      .map(() => ALPHABET[(Math.random() * ALPHABET.length) | 0])
      .join("")
  );
}

/**
 * Load the artwork with the current hash and keep the URL of this page in sync,
 * so that every piece can be shared as a link
 */
function render() {
  const params = new URLSearchParams({ fxhash: hash });

  artwork.src = `./artwork.html?${params}`;
  hashOutput.textContent = hash;
  window.history.replaceState(null, "", `?${params}`);

  features.replaceChildren(loading);
  artwork.addEventListener("load", showFeatures, { once: true });
}

function label(name) {
  // wrappedInDots -> Wrapped In Dots, wrappedInFxHash -> Wrapped In fxhash
  return name
    .replace(/FxHash/g, "-fxhash")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (first) => first.toUpperCase())
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function format(value) {
  if (typeof value === "number") return Number(value.toFixed(3));
  if (typeof value === "boolean") return value ? "yes" : "no";
  return value;
}

/**
 * The artwork is same-origin, so its features can be read directly once its
 * bundle has run. That happens before load, so there is nothing to wait for
 */
function showFeatures() {
  const rolled = artwork.contentWindow.$fxhashFeatures;

  if (!rolled) return;

  const rows = Object.entries(rolled)
    .filter(([name]) => !HIDDEN_FEATURES.includes(name))
    .map(([name, value]) => {
      const row = document.createElement("div");
      row.className = "feature";

      const key = document.createElement("span");
      key.className = "feature__name";
      key.textContent = label(name);

      const val = document.createElement("span");
      val.className = "feature__value";
      val.textContent = format(value);

      row.append(key, val);
      return row;
    });

  features.replaceChildren(...rows);
}

document.querySelector("#nd-newhash").addEventListener("click", () => {
  hash = randomHash();
  render();
});

// Same-origin, so the download happens here where the click is the user gesture.
// The token points _downloadSource at the canvas it renders into
document.querySelector("#nd-download").addEventListener("click", () => {
  const canvas =
    artwork.contentWindow._downloadSource ||
    artwork.contentDocument.querySelector("canvas");
  const link = document.createElement("a");

  link.download = `${hash}.png`;
  link.href = canvas.toDataURL();
  link.click();
});

render();
