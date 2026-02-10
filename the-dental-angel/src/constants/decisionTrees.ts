// Treatment Decision Trees
// Interactive flowcharts to help patients understand treatment decisions

export interface DecisionNode {
  id: string;
  type: 'question' | 'outcome';
  text: string;
  subtext?: string;
  options?: DecisionOption[];
  outcome?: OutcomeData;
}

export interface DecisionOption {
  label: string;
  nextNodeId: string;
}

export interface OutcomeData {
  recommendation: 'likely-needed' | 'worth-discussing' | 'may-not-need' | 'get-second-opinion';
  title: string;
  explanation: string;
  questionsToAsk: string[];
}

export interface DecisionTree {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  startNodeId: string;
  nodes: Record<string, DecisionNode>;
}

// Helper to get recommendation color
export function getRecommendationColor(recommendation: OutcomeData['recommendation']): {
  bg: string;
  text: string;
  border: string;
} {
  switch (recommendation) {
    case 'likely-needed':
      return { bg: '#EEF7F0', text: '#1B5E3F', border: '#2E7D5B' };
    case 'worth-discussing':
      return { bg: '#FFF5E6', text: '#7A5018', border: '#C27624' };
    case 'may-not-need':
      return { bg: '#EBF3FA', text: '#124A80', border: '#1E6BB8' };
    case 'get-second-opinion':
      return { bg: '#FBEAEA', text: '#7A2E2E', border: '#B84C4C' };
  }
}

export function getRecommendationLabel(recommendation: OutcomeData['recommendation']): string {
  switch (recommendation) {
    case 'likely-needed':
      return 'Likely Beneficial';
    case 'worth-discussing':
      return 'Worth Discussing';
    case 'may-not-need':
      return 'May Not Be Necessary';
    case 'get-second-opinion':
      return 'Consider a Second Opinion';
  }
}

// ============ DECISION TREES ============

export const DECISION_TREES: DecisionTree[] = [
  // ============ CROWN DECISION TREE ============
  {
    id: 'crown',
    title: 'Do I Need a Crown?',
    subtitle: 'Dental Crown Decision Guide',
    icon: 'shield-checkmark-outline',
    description:
      'Walk through key questions to understand if a crown might be right for your situation.',
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        type: 'question',
        text: 'Why was a crown recommended?',
        subtext: 'Select the main reason your dentist gave',
        options: [
          { label: 'Large filling or cavity', nextNodeId: 'large-filling' },
          { label: 'Cracked or broken tooth', nextNodeId: 'cracked' },
          { label: 'After root canal', nextNodeId: 'root-canal' },
          { label: 'Cosmetic reasons', nextNodeId: 'cosmetic' },
          { label: "Not sure / wasn't explained", nextNodeId: 'unclear' },
        ],
      },
      'large-filling': {
        id: 'large-filling',
        type: 'question',
        text: 'How much of the tooth is affected?',
        subtext: 'Think about what your dentist showed you',
        options: [
          { label: 'More than half the tooth', nextNodeId: 'outcome-likely' },
          { label: 'About half the tooth', nextNodeId: 'filling-symptoms' },
          { label: 'Less than half', nextNodeId: 'outcome-discuss-filling' },
        ],
      },
      'filling-symptoms': {
        id: 'filling-symptoms',
        type: 'question',
        text: 'Are you having any symptoms?',
        options: [
          { label: 'Yes - pain, sensitivity, or discomfort', nextNodeId: 'outcome-likely' },
          { label: 'No symptoms currently', nextNodeId: 'outcome-discuss-timing' },
        ],
      },
      cracked: {
        id: 'cracked',
        type: 'question',
        text: 'Can you see or feel the crack?',
        options: [
          { label: 'Yes, visible crack', nextNodeId: 'crack-pain' },
          { label: 'Dentist showed it on X-ray', nextNodeId: 'crack-pain' },
          { label: "I can't see anything", nextNodeId: 'outcome-second-opinion' },
        ],
      },
      'crack-pain': {
        id: 'crack-pain',
        type: 'question',
        text: 'Does the tooth hurt when you bite down?',
        options: [
          { label: 'Yes, sharp pain when biting', nextNodeId: 'outcome-urgent' },
          { label: 'Sometimes or mild discomfort', nextNodeId: 'outcome-likely' },
          { label: 'No pain at all', nextNodeId: 'outcome-discuss-timing' },
        ],
      },
      'root-canal': {
        id: 'root-canal',
        type: 'question',
        text: 'Which tooth had the root canal?',
        options: [
          { label: 'Back tooth (molar)', nextNodeId: 'outcome-likely-rootcanal' },
          { label: 'Middle tooth (premolar)', nextNodeId: 'outcome-likely' },
          { label: 'Front tooth', nextNodeId: 'outcome-discuss-front' },
        ],
      },
      cosmetic: {
        id: 'cosmetic',
        type: 'question',
        text: 'Is the tooth structurally healthy?',
        subtext: 'No decay, cracks, or large fillings',
        options: [
          {
            label: 'Yes, just want it to look better',
            nextNodeId: 'outcome-cosmetic-alternatives',
          },
          { label: 'No, there are other issues too', nextNodeId: 'outcome-likely' },
          { label: 'Not sure', nextNodeId: 'outcome-discuss-options' },
        ],
      },
      unclear: {
        id: 'unclear',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'get-second-opinion',
          title: 'Ask for More Information',
          explanation:
            "It's important to understand WHY a crown is recommended before proceeding. You have every right to ask your dentist to explain the reason clearly.",
          questionsToAsk: [
            'Can you show me on the X-ray why I need a crown?',
            "What happens if I don't get the crown?",
            'Are there any alternatives to a crown?',
            'Is this urgent or can I think about it?',
          ],
        },
      },
      'outcome-likely': {
        id: 'outcome-likely',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'likely-needed',
          title: 'Crown Likely Makes Sense',
          explanation:
            'Based on your answers, a crown appears to be a reasonable recommendation. Crowns protect weakened teeth from further damage and can last 10-15+ years with good care.',
          questionsToAsk: [
            'What type of crown do you recommend and why?',
            'How long should this crown last?',
            "What's the total cost including any other work needed?",
            'What happens during each appointment?',
          ],
        },
      },
      'outcome-discuss-filling': {
        id: 'outcome-discuss-filling',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'worth-discussing',
          title: 'A Filling Might Be Enough',
          explanation:
            'If less than half the tooth is affected and there are no cracks, a large filling might be sufficient. However, your dentist may see factors that make a crown the better long-term choice.',
          questionsToAsk: [
            'Could a large filling work instead of a crown?',
            'What are the pros and cons of each option?',
            'If I choose a filling now, might I need a crown later?',
            "What's the cost difference between the options?",
          ],
        },
      },
      'outcome-discuss-timing': {
        id: 'outcome-discuss-timing',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'worth-discussing',
          title: 'Timing May Be Flexible',
          explanation:
            'Without current symptoms, you may have some time to plan. However, waiting too long with a weakened tooth can lead to bigger problems.',
          questionsToAsk: [
            'How urgent is this crown?',
            'What are the risks of waiting a few months?',
            'What symptoms would tell me I need to come in sooner?',
            'Can we schedule this when it works best for me?',
          ],
        },
      },
      'outcome-urgent': {
        id: 'outcome-urgent',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'likely-needed',
          title: "Don't Wait on This One",
          explanation:
            'Sharp pain when biting often indicates a crack that could get worse. A crown can hold the tooth together and prevent it from splitting further, which could mean losing the tooth.',
          questionsToAsk: [
            'Is there a risk the tooth could split completely?',
            'Should I avoid chewing on this side until the crown is done?',
            'How soon can we do this?',
            'What should I do if the pain gets worse?',
          ],
        },
      },
      'outcome-second-opinion': {
        id: 'outcome-second-opinion',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'get-second-opinion',
          title: 'Consider Getting Another Opinion',
          explanation:
            'If you can\'t see any issue and nothing was clearly shown to you, it\'s reasonable to seek a second opinion. Not all "cracks" require crowns.',
          questionsToAsk: [
            'Can you show me exactly where the crack is?',
            'What will happen if we just monitor it?',
            'How did you determine a crown is needed?',
            'Would you mind if I got a second opinion?',
          ],
        },
      },
      'outcome-likely-rootcanal': {
        id: 'outcome-likely-rootcanal',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'likely-needed',
          title: 'Crown Recommended After Root Canal',
          explanation:
            'Back teeth handle a lot of chewing force. After a root canal, the tooth becomes more brittle and a crown helps prevent it from cracking. Most dentists strongly recommend crowns on molars after root canals.',
          questionsToAsk: [
            'How soon after the root canal should I get the crown?',
            'What type of crown is best for a molar?',
            'Is a temporary crown needed while we wait?',
            "What's the total investment for root canal plus crown?",
          ],
        },
      },
      'outcome-discuss-front': {
        id: 'outcome-discuss-front',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'worth-discussing',
          title: 'Crown May Be Optional for Front Teeth',
          explanation:
            "Front teeth don't bear as much chewing force, so crowns aren't always necessary after root canals. However, if the tooth is discolored or has significant damage, a crown might be the best option.",
          questionsToAsk: [
            'Is a crown necessary or could the tooth be okay without one?',
            'Would the tooth become discolored without a crown?',
            'What are my options for this front tooth?',
            'If not a crown, what would you recommend?',
          ],
        },
      },
      'outcome-cosmetic-alternatives': {
        id: 'outcome-cosmetic-alternatives',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'may-not-need',
          title: 'Consider Less Invasive Options',
          explanation:
            'If the tooth is healthy and you just want cosmetic improvement, there may be alternatives to a crown that remove less tooth structure, like veneers or bonding.',
          questionsToAsk: [
            'Would veneers or bonding achieve the same look?',
            'How much tooth structure needs to be removed for a crown?',
            'What are the pros and cons of each cosmetic option?',
            'Which option lasts longest?',
          ],
        },
      },
      'outcome-discuss-options': {
        id: 'outcome-discuss-options',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'worth-discussing',
          title: 'Get a Clear Picture First',
          explanation:
            'Before deciding, understand exactly what issues the tooth has. The right solution depends on whether there are structural problems beyond just appearance.',
          questionsToAsk: [
            'What exactly is wrong with this tooth?',
            'What are ALL my options, from simplest to most comprehensive?',
            'What do you recommend and why?',
            "Can I see photos or X-rays of what you're seeing?",
          ],
        },
      },
    },
  },

  // ============ ROOT CANAL DECISION TREE ============
  {
    id: 'root-canal',
    title: 'Do I Need a Root Canal?',
    subtitle: 'Root Canal Decision Guide',
    icon: 'medkit-outline',
    description: 'Understand when a root canal is necessary and when there might be alternatives.',
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        type: 'question',
        text: 'What symptoms are you experiencing?',
        subtext: 'Select the main issue',
        options: [
          { label: 'Severe, constant tooth pain', nextNodeId: 'severe-pain' },
          { label: 'Pain that comes and goes', nextNodeId: 'intermittent-pain' },
          { label: 'Sensitivity to hot/cold that lingers', nextNodeId: 'sensitivity' },
          { label: 'No pain - dentist found something', nextNodeId: 'no-symptoms' },
          { label: 'Swelling or bump on gums', nextNodeId: 'swelling' },
        ],
      },
      'severe-pain': {
        id: 'severe-pain',
        type: 'question',
        text: 'How long have you had this pain?',
        options: [
          { label: 'Just started (days)', nextNodeId: 'outcome-urgent-rootcanal' },
          { label: 'Weeks to months', nextNodeId: 'outcome-urgent-rootcanal' },
          { label: 'Pain is controlled with medication', nextNodeId: 'outcome-needed-soon' },
        ],
      },
      'intermittent-pain': {
        id: 'intermittent-pain',
        type: 'question',
        text: 'What triggers the pain?',
        options: [
          { label: 'Biting or chewing', nextNodeId: 'biting-pain' },
          { label: 'Hot or cold foods/drinks', nextNodeId: 'sensitivity' },
          { label: 'Seems random', nextNodeId: 'outcome-evaluate' },
        ],
      },
      'biting-pain': {
        id: 'biting-pain',
        type: 'question',
        text: 'Is this a tooth with a filling or crown?',
        options: [
          { label: 'Yes, has a filling or crown', nextNodeId: 'outcome-likely-rootcanal' },
          { label: 'No, natural tooth', nextNodeId: 'outcome-evaluate' },
          { label: 'Not sure', nextNodeId: 'outcome-evaluate' },
        ],
      },
      sensitivity: {
        id: 'sensitivity',
        type: 'question',
        text: 'How long does the sensitivity last?',
        options: [
          { label: 'Goes away within seconds', nextNodeId: 'outcome-may-not-need' },
          { label: 'Lingers for minutes', nextNodeId: 'outcome-likely-rootcanal' },
          { label: 'Causes throbbing pain', nextNodeId: 'outcome-urgent-rootcanal' },
        ],
      },
      'no-symptoms': {
        id: 'no-symptoms',
        type: 'question',
        text: 'What did the dentist find?',
        options: [
          { label: 'Dark spot on X-ray near root', nextNodeId: 'xray-finding' },
          { label: 'Very deep cavity', nextNodeId: 'deep-cavity' },
          { label: 'Previous filling is failing', nextNodeId: 'outcome-evaluate' },
          { label: 'Not clearly explained', nextNodeId: 'outcome-get-clarity' },
        ],
      },
      'xray-finding': {
        id: 'xray-finding',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'worth-discussing',
          title: 'X-Ray Findings Need Discussion',
          explanation:
            'Dark spots on X-rays near tooth roots can indicate infection, but not always. Some are harmless. Ask to see the X-ray and understand what it shows.',
          questionsToAsk: [
            "Can you show me what you're seeing on the X-ray?",
            'Is this definitely an infection or could it be something else?',
            'What happens if we monitor it instead of treating now?',
            'How certain are you that a root canal is needed?',
          ],
        },
      },
      'deep-cavity': {
        id: 'deep-cavity',
        type: 'question',
        text: 'Has the dentist tested if the nerve is still healthy?',
        options: [
          { label: 'Yes, nerve is dead or dying', nextNodeId: 'outcome-likely-rootcanal' },
          { label: 'Yes, nerve is still healthy', nextNodeId: 'outcome-maybe-filling' },
          { label: 'No testing was done', nextNodeId: 'outcome-request-test' },
        ],
      },
      swelling: {
        id: 'swelling',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'likely-needed',
          title: 'Infection Needs Treatment',
          explanation:
            "Swelling or a bump on the gums usually indicates an infection that won't go away on its own. A root canal can save the tooth by removing the infection.",
          questionsToAsk: [
            'Do I need antibiotics before the root canal?',
            'How urgent is this?',
            'What happens if the infection spreads?',
            'Will the swelling go down after the root canal?',
          ],
        },
      },
      'outcome-urgent-rootcanal': {
        id: 'outcome-urgent-rootcanal',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'likely-needed',
          title: 'Root Canal Likely Needed Soon',
          explanation:
            'Severe or persistent pain often indicates the nerve inside the tooth is inflamed or infected. A root canal removes the damaged nerve and stops the pain.',
          questionsToAsk: [
            'How soon can this be done?',
            'Will I need antibiotics?',
            'What can I do for pain until the appointment?',
            'Should I see an endodontist (root canal specialist)?',
          ],
        },
      },
      'outcome-needed-soon': {
        id: 'outcome-needed-soon',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'likely-needed',
          title: "Don't Delay Treatment",
          explanation:
            "If you're managing pain with medication, the underlying problem is still there. Getting treatment soon can prevent the situation from getting worse.",
          questionsToAsk: [
            "What's the risk of waiting longer?",
            'Could I lose the tooth if I wait?',
            "What's the next available appointment?",
            'Is there anything I should avoid doing?',
          ],
        },
      },
      'outcome-likely-rootcanal': {
        id: 'outcome-likely-rootcanal',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'likely-needed',
          title: 'Root Canal Appears Appropriate',
          explanation:
            'Your symptoms suggest the nerve inside the tooth may be damaged. A root canal can relieve your pain and save the tooth.',
          questionsToAsk: [
            "What's causing the nerve damage?",
            'Will I need a crown after the root canal?',
            "What's the total cost for everything?",
            "What's the success rate for this tooth?",
          ],
        },
      },
      'outcome-evaluate': {
        id: 'outcome-evaluate',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'worth-discussing',
          title: 'More Evaluation May Be Needed',
          explanation:
            "Your symptoms could have several causes. A thorough evaluation can determine if a root canal is truly needed or if there's another solution.",
          questionsToAsk: [
            'Can we do more tests to confirm the diagnosis?',
            'Could this be something other than a nerve problem?',
            'What other treatments might work?',
            'What happens if we wait and watch?',
          ],
        },
      },
      'outcome-may-not-need': {
        id: 'outcome-may-not-need',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'may-not-need',
          title: 'Root Canal May Not Be Necessary',
          explanation:
            "Brief sensitivity that goes away quickly is often normal and doesn't require a root canal. It could be addressed with desensitizing toothpaste or a simpler treatment.",
          questionsToAsk: [
            'Could this just be sensitivity rather than nerve damage?',
            'Would desensitizing toothpaste help?',
            'What signs would tell us a root canal is actually needed?',
            'Can we monitor this for now?',
          ],
        },
      },
      'outcome-get-clarity': {
        id: 'outcome-get-clarity',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'get-second-opinion',
          title: 'Get Clear Answers First',
          explanation:
            "Before agreeing to a root canal, you should understand exactly why it's needed. Ask for a clear explanation or consider getting a second opinion.",
          questionsToAsk: [
            'Can you explain in simple terms why I need a root canal?',
            'What did you find that leads to this recommendation?',
            'What are the alternatives?',
            'Would you mind if I got a second opinion?',
          ],
        },
      },
      'outcome-maybe-filling': {
        id: 'outcome-maybe-filling',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'worth-discussing',
          title: 'A Filling Might Work',
          explanation:
            "If the nerve is still healthy, a deep filling might be possible. However, there's a risk the nerve could become irritated and need a root canal later.",
          questionsToAsk: [
            'What are the chances the nerve will be okay after a filling?',
            'If we try a filling first and it fails, what then?',
            'Would doing the root canal now be safer long-term?',
            "What's the cost difference?",
          ],
        },
      },
      'outcome-request-test': {
        id: 'outcome-request-test',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'worth-discussing',
          title: 'Request Nerve Testing',
          explanation:
            'Before a root canal, tests should confirm the nerve is damaged. Cold tests or electric pulp tests can help determine if the nerve is still healthy.',
          questionsToAsk: [
            'Can you test if the nerve is still alive?',
            'What tests are available to check nerve health?',
            'Could we try a filling first and see?',
            'What happens if the nerve is actually healthy?',
          ],
        },
      },
    },
  },

  // ============ EXTRACTION DECISION TREE ============
  {
    id: 'extraction',
    title: 'Should I Extract This Tooth?',
    subtitle: 'Tooth Extraction Decision Guide',
    icon: 'remove-circle-outline',
    description: 'Understand when extraction is the best choice and when you might save the tooth.',
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        type: 'question',
        text: 'Why was extraction recommended?',
        options: [
          { label: 'Severe decay or damage', nextNodeId: 'severe-damage' },
          { label: 'Gum disease / loose tooth', nextNodeId: 'gum-disease' },
          { label: 'Crowding / orthodontic reasons', nextNodeId: 'crowding' },
          { label: 'Wisdom tooth issues', nextNodeId: 'wisdom' },
          { label: "Cost - can't afford other treatment", nextNodeId: 'cost' },
        ],
      },
      'severe-damage': {
        id: 'severe-damage',
        type: 'question',
        text: "What's the condition of the tooth?",
        options: [
          { label: 'Broken at gum line', nextNodeId: 'outcome-likely-extract' },
          { label: 'Large cavity but tooth intact', nextNodeId: 'salvageable' },
          { label: 'Cracked through the root', nextNodeId: 'outcome-likely-extract' },
        ],
      },
      salvageable: {
        id: 'salvageable',
        type: 'question',
        text: 'Has saving the tooth been discussed?',
        options: [
          { label: 'Yes, but it would cost too much', nextNodeId: 'cost' },
          { label: 'Yes, but success rate is low', nextNodeId: 'outcome-consider-options' },
          { label: 'No alternatives were offered', nextNodeId: 'outcome-explore-options' },
        ],
      },
      'gum-disease': {
        id: 'gum-disease',
        type: 'question',
        text: 'How loose is the tooth?',
        options: [
          { label: 'Very loose - moves easily', nextNodeId: 'outcome-likely-extract' },
          { label: 'Somewhat loose', nextNodeId: 'outcome-gum-treatment' },
          { label: 'Not loose, but gum problems', nextNodeId: 'outcome-gum-treatment' },
        ],
      },
      crowding: {
        id: 'crowding',
        type: 'question',
        text: 'Is this for braces or clear aligners?',
        options: [
          { label: 'Yes, for orthodontic treatment', nextNodeId: 'outcome-ortho-normal' },
          { label: 'No, just general crowding', nextNodeId: 'outcome-second-opinion-crowding' },
        ],
      },
      wisdom: {
        id: 'wisdom',
        type: 'question',
        text: 'Is the wisdom tooth causing problems?',
        options: [
          {
            label: 'Yes - pain, infection, or damage to other teeth',
            nextNodeId: 'outcome-wisdom-needed',
          },
          { label: 'No current problems - "preventive"', nextNodeId: 'outcome-wisdom-discuss' },
          { label: 'Partially erupted / food trapping', nextNodeId: 'outcome-wisdom-needed' },
        ],
      },
      cost: {
        id: 'cost',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'worth-discussing',
          title: 'Explore All Financial Options',
          explanation:
            'Extracting a tooth to save money now can cost more later when you need to replace it. Ask about payment plans or alternatives before deciding based on cost alone.',
          questionsToAsk: [
            'Do you offer payment plans for root canal/crown?',
            'What will it cost to replace this tooth later?',
            'Are there dental schools nearby that offer reduced rates?',
            'Is this tooth important for chewing or appearance?',
          ],
        },
      },
      'outcome-likely-extract': {
        id: 'outcome-likely-extract',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'likely-needed',
          title: 'Extraction May Be Best Option',
          explanation:
            'When a tooth is severely damaged or broken at the gum line, extraction is often the most practical choice. Focus on discussing replacement options.',
          questionsToAsk: [
            'What are my options for replacing this tooth?',
            'How soon after extraction can I get a replacement?',
            "What happens if I don't replace the tooth?",
            'What does the extraction procedure involve?',
          ],
        },
      },
      'outcome-consider-options': {
        id: 'outcome-consider-options',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'worth-discussing',
          title: 'Weigh the Options Carefully',
          explanation:
            "If success rate is low but possible, consider how important this tooth is, the cost of each option, and what you'd do if saving it fails.",
          questionsToAsk: [
            'What exactly is the success rate for saving this tooth?',
            'If we try to save it and it fails, what then?',
            'How important is this tooth for chewing?',
            'What would you do if this were your tooth?',
          ],
        },
      },
      'outcome-explore-options': {
        id: 'outcome-explore-options',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'get-second-opinion',
          title: 'Ask About Alternatives',
          explanation:
            "Before extracting, it's worth knowing if the tooth could be saved. A root canal specialist (endodontist) can often save teeth others can't.",
          questionsToAsk: [
            'Is there any way to save this tooth?',
            'Would an endodontist consultation be worthwhile?',
            'What would it take to keep this tooth?',
            "Why is extraction the only option you're offering?",
          ],
        },
      },
      'outcome-gum-treatment': {
        id: 'outcome-gum-treatment',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'worth-discussing',
          title: 'Gum Treatment Might Help',
          explanation:
            "If the tooth isn't extremely loose, gum disease treatment might stabilize it. A periodontist (gum specialist) can give you the best assessment.",
          questionsToAsk: [
            'Could gum treatment save this tooth?',
            'Would you recommend seeing a periodontist?',
            "What's the prognosis if we treat the gum disease?",
            'How loose is too loose to save?',
          ],
        },
      },
      'outcome-ortho-normal': {
        id: 'outcome-ortho-normal',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'likely-needed',
          title: 'Common for Orthodontics',
          explanation:
            "Removing teeth for orthodontic treatment is common when there's not enough room for all teeth to align properly. Your orthodontist has planned this carefully.",
          questionsToAsk: [
            'Which teeth specifically need to be removed?',
            'What happens to the spaces after braces?',
            'Is there any alternative to extraction?',
            'Who will do the extractions?',
          ],
        },
      },
      'outcome-second-opinion-crowding': {
        id: 'outcome-second-opinion-crowding',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'get-second-opinion',
          title: 'Get an Orthodontic Opinion',
          explanation:
            'Extracting teeth for crowding without orthodontic treatment is unusual. An orthodontist can tell you if extraction is really necessary.',
          questionsToAsk: [
            'Would an orthodontist consultation help?',
            'What problems is the crowding causing?',
            'Are there other ways to address this?',
            'What happens to the space after extraction?',
          ],
        },
      },
      'outcome-wisdom-needed': {
        id: 'outcome-wisdom-needed',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'likely-needed',
          title: 'Wisdom Tooth Removal Makes Sense',
          explanation:
            "When wisdom teeth cause problems - pain, infection, or damage to neighboring teeth - removal is usually the best solution. They're difficult to clean and often cause recurring issues.",
          questionsToAsk: [
            'Should I have all wisdom teeth removed at once?',
            "What's the recovery time?",
            'Will I be sedated for the procedure?',
            'What are the risks of the surgery?',
          ],
        },
      },
      'outcome-wisdom-discuss': {
        id: 'outcome-wisdom-discuss',
        type: 'outcome',
        text: 'outcome',
        outcome: {
          recommendation: 'worth-discussing',
          title: 'Preventive Removal Is Debatable',
          explanation:
            "Not all dentists agree on removing wisdom teeth that aren't causing problems. Some recommend it to prevent future issues; others prefer to wait and see.",
          questionsToAsk: [
            'What specific problems do you expect if I keep them?',
            'Can we monitor them instead of removing now?',
            "What's the risk of waiting vs. removing now?",
            'Are they likely to cause problems based on their position?',
          ],
        },
      },
    },
  },
];

// Get a decision tree by ID
export function getDecisionTree(id: string): DecisionTree | undefined {
  return DECISION_TREES.find((tree) => tree.id === id);
}
