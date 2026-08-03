/**
 * Controls for nd-genuary32nd-plants-chatgpt3-001
 *
 * The artwork (artwork.html) is the untouched fxhash token: it reads its hash
 * and its parameters from the URL. This shell asks the token for its parameter
 * definitions via postMessage, renders a control for each of them and reloads
 * the token whenever a value changes.
 */

const ALPHABET = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

const artwork = document.querySelector("#nd-artwork");
const form = document.querySelector("#nd-params");
const loading = document.querySelector("#nd-loading");
const hashOutput = document.querySelector("#nd-hash");
const redrawOutput = document.querySelector("#nd-redraw");
const redrawBar = document.querySelector("#nd-redraw-bar");

const search = new URLSearchParams(window.location.search);

let hash = search.get("fxhash") || randomHash();
let definitions = [];
let values = {};

// id -> the input + the readout that belong to a parameter
const controls = {};

// The interval the artwork is currently counting down, and when it runs out
let redrawInMs = 0;
let redrawAt = 0;

/**
 * Serialize a single parameter the same way the fxhash snippet deserializes it
 */
const serializers = {
  number: (value) => {
    const view = new DataView(new ArrayBuffer(8));
    view.setFloat64(0, Number(value));
    return toHex(new Uint8Array(view.buffer));
  },
  bigint: (value) => {
    const view = new DataView(new ArrayBuffer(8));
    view.setBigInt64(0, BigInt(value));
    return toHex(new Uint8Array(view.buffer));
  },
  boolean: (value) => (value ? "01" : "00"),
  color: (value) => String(value).replace("#", "").slice(0, 8).padEnd(8, "f"),
  string: (value) =>
    [...String(value).slice(0, 64)]
      .map((char) => char.charCodeAt(0).toString(16).padStart(4, "0"))
      .join("")
      .padEnd(256, "0"),
  select: (value, definition) =>
    Math.max(0, definition.options.options.indexOf(value))
      .toString(16)
      .padStart(2, "0"),
};

function toHex(bytes) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function randomHash() {
  return (
    "oo" +
    Array(49)
      .fill(0)
      .map(() => ALPHABET[(Math.random() * ALPHABET.length) | 0])
      .join("")
  );
}

function serializeParams() {
  return definitions
    .map((definition) => serializers[definition.type](values[definition.id], definition))
    .join("");
}

/**
 * Reload the artwork with the current hash + parameters and keep the URL of
 * this page in sync, so that every scene can be shared as a link
 */
function render() {
  const params = new URLSearchParams({ fxhash: hash });

  if (definitions.length > 0) {
    params.set("fxparams", serializeParams());
  }

  artwork.src = `./artwork.html?${params}`;
  hashOutput.textContent = hash;
  window.history.replaceState(null, "", `?${params}`);

  // The reloaded artwork rolls its own interval and reports it back
  redrawInMs = 0;
  redrawOutput.textContent = "—";
  redrawBar.style.width = "0%";
}

/**
 * The artwork reports every interval it rolls (see artwork.html). Show how much
 * of it is left, so that it is clear when the scene grows again
 */
window.addEventListener("message", (event) => {
  if (event.data?.id !== "nd_redraw") return;

  redrawInMs = event.data.data;
  redrawAt = performance.now() + redrawInMs;
});

setInterval(() => {
  if (!redrawInMs) return;

  const left = Math.max(0, redrawAt - performance.now());

  redrawOutput.textContent = `${Math.round(left)} / ${redrawInMs}ms`;
  redrawBar.style.width = `${(left / redrawInMs) * 100}%`;
}, 50);

/**
 * Build a control for every parameter definition of the artwork
 */
function createControl(definition) {
  const { id, name, type, options = {} } = definition;

  const wrapper = document.createElement("div");
  wrapper.className = "param";

  const label = document.createElement("label");
  label.className = "param__label";
  label.htmlFor = `param-${id}`;
  label.append(document.createTextNode(name || id));

  const value = document.createElement("span");
  value.className = "param__value";
  label.append(value);

  let input;

  if (type === "select") {
    input = document.createElement("select");
    for (const option of options.options) {
      input.append(new Option(option, option, false, option === values[id]));
    }
    value.remove();
  } else if (type === "boolean") {
    input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(values[id]);
    value.remove();
  } else if (type === "number") {
    input = document.createElement("input");
    input.type = "range";
    input.min = options.min;
    input.max = options.max;
    input.step = options.step || "any";
    input.value = values[id];
    value.textContent = values[id];
  } else {
    input = document.createElement("input");
    input.type = "text";
    input.value = values[id];
    value.remove();
  }

  input.id = `param-${id}`;
  input.name = id;

  const read = () => {
    if (type === "number") return Number(input.value);
    if (type === "boolean") return input.checked;
    return input.value;
  };

  // Keep the readout in sync while dragging, but only redraw once the
  // interaction is done: every change reloads the artwork
  input.addEventListener("input", () => {
    if (type === "number") value.textContent = input.value;
  });

  input.addEventListener("change", () => {
    values[id] = read();
    render();
  });

  controls[id] = { input, value };

  wrapper.append(label, input);
  return wrapper;
}

function createControls() {
  loading.remove();
  for (const definition of definitions) {
    form.append(createControl(definition));
  }
}

/**
 * Write the current values back into the controls, after they have been
 * changed from the outside (Random)
 */
function syncControls() {
  for (const { id, type } of definitions) {
    const { input, value } = controls[id];

    if (type === "boolean") {
      input.checked = Boolean(values[id]);
    } else {
      input.value = values[id];
    }

    if (type === "number") {
      value.textContent = values[id];
    }
  }
}

/**
 * A random value for a parameter, within the bounds the artwork defined
 */
function randomValue(definition) {
  const { id, type, options = {} } = definition;

  if (type === "select") {
    return options.options[(Math.random() * options.options.length) | 0];
  }

  if (type === "boolean") {
    return Math.random() < 0.5;
  }

  if (type === "number") {
    const min = Number(options.min ?? 0);
    const max = Number(options.max ?? 1);
    const value = Math.random() * (max - min) + min;

    if (!options.step) return value;

    const steps = 1 / options.step;
    return Math.min(max, Math.max(min, Math.round(value * steps) / steps));
  }

  if (type === "color") {
    return [...Array(8)]
      .map(() => ((Math.random() * 16) | 0).toString(16))
      .join("");
  }

  return values[id];
}

/**
 * The artwork answers "fxhash_getParams" with its definitions + values, but
 * only once its bundle has run, so we ask until we get an answer
 */
function requestParams() {
  const handshake = setInterval(() => {
    artwork.contentWindow.postMessage("fxhash_getParams", "*");
  }, 100);

  window.addEventListener("message", (event) => {
    if (event.data?.id !== "fxhash_getParams") return;
    if (!Array.isArray(event.data.data?.definitions)) return;

    clearInterval(handshake);

    definitions = event.data.data.definitions;
    values = event.data.data.values;

    createControls();
  });
}

// Roll new values for every parameter, but stay on the same hash
document.querySelector("#nd-random").addEventListener("click", () => {
  for (const definition of definitions) {
    values[definition.id] = randomValue(definition);
  }

  syncControls();
  render();
});

// Roll a new hash, but keep the parameters
document.querySelector("#nd-newhash").addEventListener("click", () => {
  hash = randomHash();
  render();
});

// The artwork is same-origin, so we can grab its canvas from here. Doing the
// download in this document keeps the click as the user gesture
document.querySelector("#nd-download").addEventListener("click", () => {
  const canvas = artwork.contentDocument.querySelector("canvas#nd-output");
  const link = document.createElement("a");
  link.download = `${hash}.png`;
  link.href = canvas.toDataURL();
  link.click();
});

// Start with the scene from the URL (if there is one) so links are shareable
const initial = new URLSearchParams({ fxhash: hash });
if (search.get("fxparams")) {
  initial.set("fxparams", search.get("fxparams"));
}
artwork.src = `./artwork.html?${initial}`;
hashOutput.textContent = hash;

artwork.addEventListener("load", requestParams, { once: true });
