import { pogData } from "./utils/pogdata";
import { fetch } from "../../tska/polyfill/Fetch";

const thresholds = [
  { value: 1e9, symbol: "B", precision: 1 },
  { value: 1e6, symbol: "M", precision: 1 },
  { value: 1e3, symbol: "K", precision: 1 }
];

register("worldLoad", () => {
    pogData.goldorsection = 0;
});

register("chat", (message) =>
    [
      {
        predicate: msg => msg.startsWith("[BOSS] Storm: I should have known that I stood no chance."),
        action: () => pogData.goldorsection = 1
      },
      {
        predicate: msg => (msg.includes("(7/7)") || msg.includes("(8/8)")) && !msg.includes(":"),
        action: () => pogData.goldorsection += 1
      },
      {
        predicate: msg => msg === "The Core entrance is opening!",
        action: () => pogData.goldorsection = 5
      },
      {
        predicate: msg => msg === "[BOSS] Necron: You went further than any human before, congratulations.",
        action: () => pogData.goldorsection = 0
      }
    ].find(({ predicate }) => predicate(message))?.action()
).setCriteria("${message}");  

export function formatNumber(number) {
    const num = parseFloat(number.toString().replace(/,/g, ''));
    const threshold = thresholds.find(({ value }) => num >= value);
    return threshold
      ? `${(num / threshold.value).toFixed(threshold.precision)}${threshold.symbol}`
      : num;
}

export function SendMsg(webhookUrl, message) {
  return fetch(webhookUrl, {
      method: "POST",
      body: { content: message }
  });
}
