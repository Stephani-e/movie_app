export const interceptWarnings = () => {
    const originalWarn = console.warn;
    const originalError = console.error;

    const intercept = (msg: any, ...args: any[]) => {
        const message = typeof msg === "string" ? msg : "";

        if (message.includes("Encountered two children with the same key")) {
            const matchedKey = message.match(/key, [`']?([^`']+)[`']?/);
            const keyValue = matchedKey ? matchedKey[1] : "UNKNOWN";

            console.log("🚨 Duplicate key detected:", keyValue);
            console.log("🔍 Full warning:", message);
            console.log("🔍 Warning raw message:", msg, ...args);
            console.trace("🧭 Stack trace to find the source component");
        }

        // still show all warnings
        originalWarn.apply(console, [msg, ...args]);
        originalError.apply(console, [msg, ...args]);
    };

    console.warn = intercept;
    console.error = intercept;
};
