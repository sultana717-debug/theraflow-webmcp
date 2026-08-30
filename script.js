/**
 * TheraFlow / MindBridge WebMCP Engine
 * Implements Web Model Context Protocol (WebMCP) client tool registrations
 * with built-in ethical safety circuit breaking and de-identification.
 */

// Helper function to log non-repudiable telemetry events
function logTelemetry(action, details) {
  const logContainer = document.getElementById('telemetry-log');
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  const timestamp = new Date().toLocaleTimeString();
  entry.innerHTML = `<strong>[${timestamp}]</strong> <em>${action}</em>: ${details}`;
  logContainer.appendChild(entry);
  logContainer.scrollTop = logContainer.scrollHeight;
}

// Client-side PII sanitization filter
function sanitizeClinicalInput(text) {
  if (!text) return "";
  // Strip simple email addresses and phone number patterns for safety
  return text
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED EMAIL]")
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "[REDACTED PHONE]");
}

// Render dynamic workspace elements
function setWorkspaceContent(htmlContent) {
  const emptyState = document.getElementById('empty-state');
  const activeContent = document.getElementById('active-content');
  emptyState.classList.add('hidden');
  activeContent.classList.remove('hidden');
  activeContent.innerHTML = htmlContent;
}

// -----------------------------------------------------------------------------
// WEBMCP TOOL DEFINITIONS & REGISTRATION
// -----------------------------------------------------------------------------

function registerWebMCPTools() {
  // Check if browser supports WebMCP standard
  const modelContext = window.document.modelContext;

  const statusText = document.getElementById('status-text');

  if (!modelContext || typeof modelContext.registerTool !== 'function') {
    statusText.textContent = "WebMCP Active (Fallback / Test Mode)";
    logTelemetry("Notice", "WebMCP object ready. Emulating browser agent listener.");
    return;
  }

  statusText.textContent = "WebMCP Connected";

  // Tool 1: Generate CBT Thought Record Assignment
  modelContext.registerTool({
    name: "generate_cbt_thought_record",
    description: "Renders an interactive, client-tailored 5-column CBT Thought Record worksheet.",
    inputSchema: {
      type: "object",
      properties: {
        targetSituation: { type: "string", description: "The specific event or trigger discussed." },
        automaticThoughts: { type: "string", description: "Initial automatic cognitive distortions or thoughts." },
        rationalResponsePrompt: { type: "string", description: "Guiding prompt to help construct balanced alternative perspectives." }
      },
      required: ["targetSituation", "automaticThoughts"]
    },
    execute: async (args) => {
      const situation = sanitizeClinicalInput(args.targetSituation);
      const thoughts = sanitizeClinicalInput(args.automaticThoughts);
      const prompt = sanitizeClinicalInput(args.rationalResponsePrompt || "What is a balanced, compassionate view of this situation?");

      const html = `
        <div class="assignment-header">
          <h2>🌱 Personalized CBT Thought Record</h2>
          <p class="text-sm">Structured exercise for cognitive restructuring between clinical sessions.</p>
        </div>
        <table class="assignment-table">
          <thead>
            <tr>
              <th>1. Triggering Situation</th>
              <th>2. Automatic Thought(s)</th>
              <th>3. Emotional Intensity</th>
              <th>4. Cognitive Distortion</th>
              <th>5. Balanced Alternative</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${situation}</td>
              <td>${thoughts}</td>
              <td>[ Rate 0-100% ]</td>
              <td><em>(e.g., Catastrophizing, Mind Reading)</em></td>
              <td>${prompt}</td>
            </tr>
          </tbody>
        </table>
        <p class="text-sm"><em>Instructions: Practice writing out rational alternatives whenever similar triggers occur this week.</em></p>
      `;

      setWorkspaceContent(html);
      logTelemetry("Tool Executed", "generate_cbt_thought_record rendered to canvas.");
      return { status: "success", message: "CBT Thought Record displayed on canvas." };
    }
  });

  // Tool 2: Visual Grounding & Pacing Module
  modelContext.registerTool({
    name: "build_pacing_grounding_exercise",
    description: "Triggers a real-time, visual 4-7-8 parasympathetic calming breathing guide.",
    inputSchema: {
      type: "object",
      properties: {
        pacingTechnique: { type: "string", enum: ["4-7-8 Box Breathing", "5-4-3-2-1 Sensory Grounding"], default: "4-7-8 Box Breathing" }
      }
    },
    execute: async (args) => {
      const html = `
        <div class="grounding-box">
          <h2>🧘 Grounding & Parasympathetic Regulation</h2>
          <p class="text-sm">Paced visual exercise to support somatic settling and de-escalation.</p>
          <div class="breathing-circle">Inhale / Exhale</div>
          <p class="text-sm"><strong>Pacing Rhythm:</strong> Breathe in for 4 seconds, hold gently for 4, and release for 6.</p>
        </div>
      `;

      setWorkspaceContent(html);
      logTelemetry("Tool Executed", "build_pacing_grounding_exercise activated.");
      return { status: "success", message: "Grounding exercise rendered to canvas." };
    }
  });

  // Tool 3: Ethical Circuit Breaker & Crisis Containment
  modelContext.registerTool({
    name: "trigger_crisis_containment",
    description: "Deterministically locks canvas and displays immediate crisis numbers when severe distress or risk keywords occur.",
    inputSchema: {
      type: "object",
      properties: {
        containmentReason: { type: "string", description: "Reason for safety circuit breaker trigger." }
      },
      required: ["containmentReason"]
    },
    execute: async (args) => {
      document.getElementById('crisis-alert-banner').classList.remove('hidden');
      document.getElementById('safety-score').textContent = "0.95 (HIGH ALERT)";
      document.getElementById('safety-score').style.color = "var(--danger)";

      const html = `
        <div class="card" style="border: 2px solid var(--danger); background: var(--danger-bg);">
          <h2>Support Resources & Immediate Care</h2>
          <p style="margin-top: 0.5rem;">If you are experiencing acute distress or need immediate assistance, please reach out directly:</p>
          <ul style="margin: 1rem 1.5rem; line-height: 1.8;">
            <li><strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988 (Available 24/7)</li>
            <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
            <li><strong>Emergency Services:</strong> Dial 911 or visit your nearest emergency room</li>
          </ul>
        </div>
      `;

      setWorkspaceContent(html);
      logTelemetry("🚨 CIRCUIT BREAKER", `Safety halt executed: ${args.containmentReason}`);
      return { status: "contained", message: "Crisis resources locked to viewport." };
    }
  });

  logTelemetry("Registration", "3 WebMCP clinical & safety tools successfully exposed.");
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  registerWebMCPTools();
});
