export const enableDuplicateKeyDebugging = () => {
    const originalWarn = console.warn;

    console.warn = function (msg: any, ...args: any[]) {
        if (typeof msg === "string" && msg.includes("Encountered two children with the same key")) {
            console.log("🧩 DUPLICATE KEY DETECTED!");
            console.log("Full warning message:", msg);
            console.log("Arguments:", args);
            console.trace("🔍 Stack trace to locate the component:");
        }

        // Still pass the warning along
        originalWarn.apply(console, [msg, ...args]);
    };
};
