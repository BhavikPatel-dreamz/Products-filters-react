import { createUser, createSession } from "../service/api";
async function getOrCreateAnonymousId() {
  let id = localStorage.getItem("anonymous_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("anonymous_id", id);
  }
  return id;
}

async function getStoredUserId() {
  return localStorage.getItem("user_id");
}

async function setUserId(id) {
  localStorage.setItem("user_id", id);
}

async function getStoredSessionId() {
  return sessionStorage.getItem("session_id");
}

async function setSessionId(id) {
  sessionStorage.setItem("session_id", id);
}

const buildDeviceInfo = () => {
  const timezone =
    Intl.DateTimeFormat?.().resolvedOptions?.().timeZone || undefined;

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    timezone,
    screen: {
      width: window.screen?.width,
      height: window.screen?.height,
      pixelRatio: window.devicePixelRatio,
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    deviceMemory: navigator.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
  };
};

export async function ensureUser() {
  let userId = await getStoredUserId();
  if (userId) return userId;

  const anonymousId = await getOrCreateAnonymousId();

  const payload = {
    shopifyCustomerId: null,
    email: null,
    shopifyStoreID: "sopify",
    anonymousId,
    deviceInfo: buildDeviceInfo,
  };
  const res = await createUser(payload);

  const data = res.data;

  if (data.newuser?._id) {
    userId = data.newuser._id;
  } else {
    userId = data.userId || null;
  }

  if (userId) await setUserId(userId);

  return userId;
}

export async function ensureSession(userId) {
  let sessionId = await getStoredSessionId();
  if (sessionId) return sessionId;
  const payload = {
    userId,
    landingPage: String(window.location.href || ""),
  };
  const res = await createSession(payload);

  const data = await res.data;

  sessionId = data.newsession?._id;
  if (sessionId) await setSessionId(sessionId);

  return sessionId;
}
