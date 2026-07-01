import { ExampleItem } from "./types";

export const EXAMPLES_DATA: ExampleItem[] = [
  {
    id: "legal-nda",
    title: "Non-Disclosure Agreement Clause",
    category: "Legal",
    description: "Standard, wordy legal terms regarding proprietary information and exclusions.",
    text: `Notwithstanding the foregoing, the obligations of confidentiality and non-use set forth in Section 3 hereof shall not apply to any portion of the Proprietary Information which the Receiving Party can demonstrate by clear and convincing contemporaneous written evidence: (i) is or becomes generally known to the public other than as a direct or indirect result of a disclosure by the Receiving Party or its representatives in violation of this Agreement; (ii) was in the rightful possession of the Receiving Party prior to the time of disclosure by the Disclosing Party; (iii) is received by the Receiving Party on a non-confidential basis from a third party having the legal right to make such disclosure; or (iv) is independently developed by the Receiving Party without reference to or reliance upon any Proprietary Information.`
  },
  {
    id: "medical-echo",
    title: "Echocardiogram Clinical Summary",
    category: "Medical",
    description: "Dense cardiac assessment report featuring anatomical abbreviations and shorthand metrics.",
    text: `Transthoracic echocardiogram reveals mild concentric left ventricular hypertrophy with preserved global systolic function (LVEF estimated at 55-60%). No regional wall motion abnormalities are visualized. Mitral valve leaflet thickening is noted with trace mitral regurgitation. Peak transmitral early-to-late diastolic velocity ratio (E/A ratio) is <1.0, indicative of Grade I diastolic dysfunction (impaired relaxation pattern). Right ventricular size and systolic performance are within normal physiological limits. Trivial tricuspid regurgitation is present with an estimated pulmonary artery systolic pressure (PASP) of 28 mmHg, indicating no acute pulmonary hypertension.`
  },
  {
    id: "tech-consensus",
    title: "Distributed Systems Consensus",
    category: "Tech",
    description: "High-level computer science explanation of distributed database replication and leader election.",
    text: `To achieve fault-tolerant state machine replication in a distributed system, a consensus algorithm such as Paxos or Raft must be implemented to enforce a total order of transactions across independent nodes. During a consensus epoch, a single leader is elected through randomized election timeouts to append entries to its replicated log. It then issues AppendEntries remote procedure calls (RPCs) to follower nodes, which must write the entry to non-volatile storage and acknowledge receipt. Once a quorum (greater than n/2) of positive acknowledgements is received, the leader commits the transaction, updates its local state machine, and signals commit advancement to followers in subsequent heartbeats.`
  },
  {
    id: "academic-philosophy",
    title: "Epistemological Philosophy Abstract",
    category: "Academic",
    description: "Abstract, self-important philosophy of perception and ontological theory.",
    text: `This paper interrogates the phenomenological intersectionality of subjective epistemic certainty and ontological realism. By deconstructing the post-structuralist critique of absolute truth claims, we propose that perceptual apprehension is not merely a passive instantiation of sensory data, but rather an active, dialectical co-construction between the conscious intentionality of the epistemic subject and the mind-independent immanence of the external object. We argue that through this cognitive-hermeneutic synthesis, the traditional cartesian split is transcended, revealing a fluid, relational ontology where being and knowing are fundamentally co-constituted in the lifeworld.`
  }
];
