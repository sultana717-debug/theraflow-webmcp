# TheraFlow / MindBridge WebMCP

**TheraFlow / MindBridge** is an ethical, clinical AI workspace built for **The WebMCP Challenge**. It enables browser-based AI agents to dynamically generate interactive psychoeducational exercises (such as CBT Thought Records and visual grounding routines) while enforcing strict client-side safety guardrails, de-identification, and crisis circuit breakers.

---

## 🌟 How WebMCP Works in TheraFlow

Instead of requiring an AI agent to scrape web pages or simulate mouse clicks, TheraFlow registers structured tools directly in the browser using the client-side WebMCP standard (`document.modelContext.registerTool`). 

When an AI agent (via Google Chrome or ChatGPT's browser) visits the workspace, it natively discovers these registered capabilities and executes them via structured parameters.

---

## 🛠️ Exposed WebMCP Tools

1. **`generate_cbt_thought_record`**
   * **Purpose:** Takes a triggering event, automatic thought, and balanced perspective prompt, and dynamically renders an interactive 5-column CBT Thought Record table on the active canvas.
   * **Inputs:** `targetSituation`, `automaticThoughts`, `rationalResponsePrompt`.

2. **`build_pacing_grounding_exercise`**
   * **Purpose:** Initiates an animated, visual 4-7-8 breathing circle directly in the DOM to assist with parasympathetic calming and de-escalation.
   * **Inputs:** `pacingTechnique`.

3. **`trigger_crisis_containment`**
   * **Purpose:** Acts as a deterministic ethical circuit breaker. If acute distress or crisis keywords are detected, the agent triggers this tool to immediately lock the canvas and display verified support lifelines (988 Lifeline, Crisis Text Line).
   * **Inputs:** `containmentReason`.

---

## 🛡️ Ethical Safety & Data Privacy

* **Client-Side Sanitization:** All incoming text passed through WebMCP tool arguments is filtered in JavaScript to strip PII (such as phone numbers and email addresses) before rendering.
* **Deterministic Containment:** Safety overrides take precedence over agent generation, ensuring verified resources are displayed during acute distress.
* **Audit Telemetry:** Every tool invocation and safety state transition is written to an on-screen runtime telemetry log for full visibility.

---

## 🚀 Live Testing & Setup

1. **Live URL:** [https://sultana717-debug.github.io/theraflow-webmcp/](https://sultana717-debug.github.io/theraflow-webmcp/)
2. **Chrome Setup:**
   * Navigate to `chrome://flags/#enable-webmcp-testing`.
   * Set the flag to **Enabled** and relaunch Chrome.
   * Open the live link to interact with the registered tools.
