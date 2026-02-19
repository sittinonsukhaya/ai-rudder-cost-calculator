/**
 * AI Rudder Cost Calculator - i18n Module (ES Module)
 *
 * Lightweight bilingual translation (EN/TH).
 * Persists language preference in localStorage.
 * Scans data-i18n attributes for static HTML translation.
 */

const translations = {
  en: {
    // Section headings and descriptions
    'section.clientOps': 'Client Operations',
    'section.clientOpsDesc': "Describe the client's current operation",
    'section.channels': 'Service Operational Channels (Voice, Chat, SMS)',
    'section.rates': 'Rates Comparison',
    'section.ratesDesc': "Compare per-interaction costs. AI Rudder's Bot Call Rates (AICalling) applies to deflected interactions that Bot handles, AI Rudder Call Rates (AICC) Rate applied to interaction done by human agent.",
    'section.additionalCosts': 'Additional Costs',
    'section.additionalCostsDesc': 'Add any other operating costs not covered above',
    'section.clientState': 'Client Current State',
    'section.aiSolution': 'AI Rudder Solution',
    'section.aiConfig': 'AI Rudder Operation',
    'section.aiConfigDesc': 'Describe Possible Operation with AI Rudder Solution',
    'section.efficiency': 'Efficiency Offset',
    'section.efficiencyDesc': 'Estimate additional hours saved through back-office automation',
    'section.dashboard': 'Dashboard',
    'section.chartTitle': '24-Month Cost Comparison',
    'section.chartDesc': 'Cumulative total costs over 24 months including service operation channel costs, agent payroll, and additional costs. The green shaded area between the lines represents your savings with AI Rudder. Admin efficiency gains are additional savings reflected in the dashboard above.',

    // Field labels and descriptions
    'field.totalAgents': 'Total Number of Current Agents',
    'field.totalAgentsDesc': 'Number of human agents handling customer interactions',
    'field.monthlySalary': 'Avg Monthly Salary per Agent',
    'field.monthlySalaryDesc': 'Including benefits and overhead per agent',
    'field.channelName': 'Channel Name',
    'field.channelNameDesc': 'Exmaple: Agent Calling',
    'field.volume': 'Volume (per month)',
    'field.volumeDesc': 'Number of Monthly Interaction',
    'field.handleTime': 'Avg Handle Time (Minutes)',
    'field.handleTimeDesc': 'Average amount of time required for a human agent to handle a call',
    'field.aiHandleTime': 'AI Handle Time (Minutes)',
    'field.aiHandleTimeDesc': 'Average amount of time required for a Bot to handle a voice/chat interaction',
    'field.voiceAiHandleTime': 'Avg Handle Time by Voice Bot (Minutes)',
    'field.voiceAiHandleTimeDesc': 'Average amount of time required for a Bot handles a voice call',
    'field.chatAiHandleTime': 'Avg Handle Time by Chat Bot (Minutes)',
    'field.chatAiHandleTimeDesc': 'Average duration when Bot handles a chat session',
    'field.deflectionRate': 'Bot Deflection Rate',
    'field.deflectionRateDesc': 'Percentage of interactions fully handled by Bot without human intervention',
    'field.adminHours': 'Hours Saved by Automation',
    'field.adminHoursDesc': 'Total hours/month freed by Automation — e.g. autodialing, queue handling, admin tasks',
    'field.chatHandleTime': 'Avg Handle Time (Minutes)',
    'field.chatHandleTimeDesc': 'Average amount of time required for a human agent to handle a chat session',
    'field.costName': 'Cost Name',
    'field.amount': 'Amount',

    // Channel types and units
    'channel.voice': 'Voice',
    'channel.sms': 'SMS',
    'channel.chat': 'Chat',
    'channel.perMinute': 'per minute',
    'channel.perMessage': 'per message',
    'channel.perSession': 'per session',

    // Frequency display labels
    'freq.oneTime': 'One-time',
    'freq.monthly': 'Monthly',
    'freq.yearly': 'Yearly',
    'freq.perAgent': 'Per Agent',

    // Button labels
    'btn.guide': 'Guide',
    'btn.save': 'Save',
    'btn.load': 'Load',
    'btn.delete': 'Delete',
    'btn.addChannel': 'Add Channel',
    'btn.addCostItem': 'Add Cost Item',
    'btn.cancel': 'Cancel',
    'btn.confirm': 'Confirm',

    // Rates table headers
    'rates.channel': 'Service Operation Channel',
    'rates.clientRate': 'Client Rate',
    'rates.aiBotRate': "AI Rudder's Bot Call Rates (AICalling)",
    'rates.aiAgentRate': 'AI Rudder Call Rates (AICC)',

    // Dashboard metric labels and hints
    'metric.currentMonthly': 'Current Operations Cost',
    'metric.currentMonthlyHint': 'Total monthly cost: channels + payroll + additional costs',
    'metric.aiMonthly': 'Operations Cost with AI Rudder',
    'metric.aiMonthlyHint': 'Total monthly cost: channels + retained payroll + additional costs',
    'metric.monthlySavings': 'Monthly Savings',
    'metric.monthlySavingsHint': 'Direct operational cost reduction',
    'metric.costReduction': 'Cost Reduction',
    'metric.costReductionHint': 'Percentage of current cost saved monthly',
    'metric.initialInvestment': 'Initial Investment',
    'metric.initialInvestmentHint': 'One-time setup costs',
    'metric.breakEven': 'Break-Even',
    'metric.breakEvenHint': 'When cumulative savings exceed investment',
    'metric.year1Savings': 'Year 1 Net Savings',
    'metric.year1SavingsHint': '12 months of direct savings minus initial investment',
    'metric.roi': 'ROI',
    'metric.roiHint': 'Return on initial investment in Year 1',
    'metric.perInteraction': 'avg {amount}/interaction',
    'metric.costComparison': 'Cost Comparison',
    'metric.directSavings': 'Direct Savings',

    // Efficiency Gains
    'efficiency.title': 'Efficiency Gains',
    'efficiency.agentsFreed': 'Agents Freed Up',
    'efficiency.agentsFreedHint': 'Available for higher-value tasks ({pct}% automated)',
    'efficiency.hoursReclaimed': 'Hours Reclaimed',
    'efficiency.hoursReclaimedHint': '{n} hrs/mo (~{eq} agents equivalent)',
    'efficiency.extraCapacity': 'Extra Serving Capacity',
    'efficiency.extraCapacityHint': '+{n} customers/mo',
    'efficiency.capacityIncrease': 'Capacity Increase',
    'efficiency.capacityIncreaseHint': 'Team throughput gained',
    'efficiency.estimatedValue': 'Estimated Value',
    'efficiency.estimatedValueHint': 'Monetary value of reclaimed time',

    // Chart labels
    'chart.currentSystem': 'Current System',
    'chart.aiRudder': 'AI Rudder',
    'chart.month': 'Month {n}',

    // Modal titles and messages
    'modal.saveTitle': 'Save Scenario',
    'modal.saveMsg': 'Enter a name for this scenario:',
    'modal.savePlaceholder': 'Scenario name',
    'modal.loadTitle': 'Load Scenario',
    'modal.loadMsg': 'Load scenario "{name}"? This will replace your current inputs.',
    'modal.deleteTitle': 'Delete Scenario',
    'modal.deleteMsg': 'Are you sure you want to delete "{name}"? This cannot be undone.',

    // Toast messages
    'toast.enterName': 'Please enter a scenario name',
    'toast.scenarioSaved': 'Scenario "{name}" saved',
    'toast.saveFailed': 'Failed to save scenario',
    'toast.selectFirst': 'Select a scenario from the dropdown first',
    'toast.scenarioLoaded': 'Scenario "{name}" loaded',
    'toast.loadFailed': 'Failed to load scenario',
    'toast.scenarioDeleted': 'Scenario "{name}" deleted',
    'toast.deleteFailed': 'Failed to delete scenario',

    // Misc
    'misc.selectScenario': 'Select a scenario...',
    'misc.removeChannel': 'Remove channel',
    'misc.remove': 'Remove',
    'misc.noChannels': 'Add channels above to see rates.',
    'misc.noCostItems': 'No cost items added yet',
    'misc.na': 'N/A',
    'misc.placeholder.channelName': 'e.g., Inbound Sales',
    'misc.placeholder.costName': 'Cost Name',

    // Header
    'header.title': 'Cost Calculator',
    'header.subtitle': 'Interactive ROI Analysis for Collaborative Sales Sessions'
  },

  th: {
    // Section headings and descriptions
    'section.clientOps': 'ข้อมูลลูกค้า',
    'section.clientOpsDesc': 'ตัวเลขการดำเนินงานปัจจุบันของลูกค้า',
    'section.channels': 'ช่องทางให้บริการ (โทร,แชท, SMS)',
    'section.rates': 'อัตราต้นทุนในช่องทางต่างๆ',
    'section.ratesDesc': 'เปรียบเทียบต้นทุนต่อการโต้ตอบลูกค้า โดย อัตรา AI Rudder Bot ใช้สำหรับการโต้ตอบที่ Bot ดำเนินการ, อัตรา AI Rudder Agent ใช้สำหรับการโต้ตอบที่มีเจ้าหน้าที่ช่วย',
    'section.additionalCosts': 'ค่าใช้จ่ายเพิ่มเติม',
    'section.additionalCostsDesc': 'เพิ่มค่าใช้จ่ายดำเนินงานอื่นๆ ที่ยังไม่ได้ระบุข้างต้น',
    'section.clientState': 'ค่าใช้จ่ายอื่นของลูกค้า',
    'section.aiSolution': 'ค่าใข้จ่ายเมื่อใช้ AI Rudder',
    'section.aiConfig': 'การตั้งค่า AI Rudder',
    'section.aiConfigDesc': 'กำหนดค่าวิธีที่ AI Rudder จัดการการโต้ตอบกับลูกค้า',
    'section.efficiency': 'ประสิทธิภาพเพิ่มเติม',
    'section.efficiencyDesc': 'ประเมินชั่วโมงที่ประหยัดได้จากระบบอัตโนมัติงานบริหาร',
    'section.dashboard': 'แดชบอร์ด',
    'section.chartTitle': 'เปรียบเทียบต้นทุน 24 เดือน',
    'section.chartDesc': 'ต้นทุนสะสมรวม 24 เดือน รวมค่าช่องทาง ค่าจ้างเจ้าหน้าที่ และค่าใช้จ่ายเพิ่มเติม พื้นที่สีเขียวระหว่างเส้นแสดงจำนวนเงินที่ประหยัดได้กับ AI Rudder ประสิทธิภาพ Admin ที่เพิ่มขึ้นจะแสดงในแดชบอร์ดด้านบน',

    // Field labels and descriptions
    'field.totalAgents': 'จำนวนเจ้าหน้าที่ปัจจุบัน',
    'field.totalAgentsDesc': 'จำนวนเจ้าหน้าที่ที่จัดการการโต้ตอบกับลูกค้า',
    'field.monthlySalary': 'เงินเดือนเฉลี่ยต่อเจ้าหน้าที่',
    'field.monthlySalaryDesc': 'รวมสวัสดิการและค่าใช้จ่ายต่อเจ้าหน้าที่',
    'field.channelName': 'ชื่อช่องทาง',
    'field.channelNameDesc': 'ป้ายที่แสดงในตารางเปรียบเทียบอัตรา',
    'field.volume': 'ปริมาณ',
    'field.volumeDesc': 'จำนวนการโต้ตอบต่อเดือน',
    'field.handleTime': 'เวลาจัดการเฉลี่ย (นาที)',
    'field.handleTimeDesc': 'ระยะเวลาต่อสายที่เจ้าหน้าที่รับ',
    'field.aiHandleTime': 'เวลาจัดการ AI (นาที)',
    'field.aiHandleTimeDesc': 'ระยะเวลาเฉลี่ยเมื่อ AI จัดการการโต้ตอบเสียง/แชท',
    'field.voiceAiHandleTime': 'เวลาจัดการ AI เสียง (นาที)',
    'field.voiceAiHandleTimeDesc': 'ระยะเวลาเฉลี่ยเมื่อ AI จัดการสายเสียง',
    'field.chatAiHandleTime': 'เวลาจัดการ AI แชท (นาที)',
    'field.chatAiHandleTimeDesc': 'ระยะเวลาเฉลี่ยเมื่อ AI จัดการเซสชันแชท',
    'field.deflectionRate': 'อัตรา AI Deflection',
    'field.deflectionRateDesc': 'เปอร์เซ็นต์ของการโต้ตอบที่ AI จัดการได้ทั้งหมดโดยไม่ต้องมีเจ้าหน้าที่',
    'field.adminHours': 'ชั่วโมงที่ประหยัดจากระบบอัตโนมัติ',
    'field.adminHoursDesc': 'ชั่วโมงทั้งหมด/เดือนที่ AI ช่วยลด เช่น โทรอัตโนมัติ จัดการคิว งานบริหาร',
    'field.chatHandleTime': 'เวลาจัดการเฉลี่ย (นาที)',
    'field.chatHandleTimeDesc': 'ระยะเวลาต่อเซสชันแชทที่เจ้าหน้าที่จัดการ',
    'field.costName': 'ชื่อรายการ',
    'field.amount': 'จำนวนเงิน',

    // Channel types and units
    'channel.voice': 'เสียง',
    'channel.sms': 'SMS',
    'channel.chat': 'แชท',
    'channel.perMinute': 'ต่อนาที',
    'channel.perMessage': 'ต่อข้อความ',
    'channel.perSession': 'ต่อเซสชัน',

    // Frequency display labels
    'freq.oneTime': 'ครั้งเดียว',
    'freq.monthly': 'รายเดือน',
    'freq.yearly': 'รายปี',
    'freq.perAgent': 'ต่อเจ้าหน้าที่',

    // Button labels
    'btn.guide': 'คู่มือ',
    'btn.save': 'บันทึก',
    'btn.load': 'โหลด',
    'btn.delete': 'ลบ',
    'btn.addChannel': 'เพิ่มช่องทาง',
    'btn.addCostItem': 'เพิ่มรายการ',
    'btn.cancel': 'ยกเลิก',
    'btn.confirm': 'ยืนยัน',

    // Rates table headers
    'rates.channel': 'ช่องทาง',
    'rates.clientRate': 'อัตราลูกค้า',
    'rates.aiBotRate': 'อัตรา Bot AI Rudder',
    'rates.aiAgentRate': 'อัตรา AI Rudder',

    // Dashboard metric labels and hints
    'metric.currentMonthly': 'ต้นทุนดำเนินงานปัจจุบัน',
    'metric.currentMonthlyHint': 'ต้นทุนรายเดือนรวม: ช่องทาง + เงินเดือน + ค่าใช้จ่ายเพิ่มเติม',
    'metric.aiMonthly': 'ต้นทุนดำเนินงานกับ AI Rudder',
    'metric.aiMonthlyHint': 'ต้นทุนรายเดือนรวม: ช่องทาง + เงินเดือนที่เหลือ + ค่าใช้จ่ายเพิ่มเติม',
    'metric.monthlySavings': 'ประหยัดรายเดือน',
    'metric.monthlySavingsHint': 'ลดต้นทุนดำเนินงานโดยตรง',
    'metric.costReduction': 'ลดต้นทุน',
    'metric.costReductionHint': 'เปอร์เซ็นต์ต้นทุนปัจจุบันที่ประหยัดได้ต่อเดือน',
    'metric.initialInvestment': 'เงินลงทุนเริ่มต้น',
    'metric.initialInvestmentHint': 'ค่าติดตั้งครั้งเดียว',
    'metric.breakEven': 'จุดคุ้มทุน',
    'metric.breakEvenHint': 'เมื่อเงินออมสะสมเกินเงินลงทุน',
    'metric.year1Savings': 'ประหยัดสุทธิปีที่ 1',
    'metric.year1SavingsHint': 'เงินออมโดยตรง 12 เดือนหักเงินลงทุนเริ่มต้น',
    'metric.roi': 'ROI',
    'metric.roiHint': 'ผลตอบแทนจากเงินลงทุนเริ่มต้นในปีที่ 1',
    'metric.perInteraction': 'เฉลี่ย {amount}/การโต้ตอบ',
    'metric.costComparison': 'เปรียบเทียบต้นทุน',
    'metric.directSavings': 'ประหยัดโดยตรง',

    // Efficiency Gains
    'efficiency.title': 'ประสิทธิภาพที่เพิ่มขึ้น',
    'efficiency.agentsFreed': 'เจ้าหน้าที่ที่ว่าง',
    'efficiency.agentsFreedHint': 'พร้อมสำหรับงานที่มีมูลค่าสูงขึ้น ({pct}% อัตโนมัติ)',
    'efficiency.hoursReclaimed': 'ชั่วโมงที่ได้คืน',
    'efficiency.hoursReclaimedHint': '{n} ชม./เดือน (~{eq} เจ้าหน้าที่เทียบเท่า)',
    'efficiency.extraCapacity': 'ศักยภาพการให้บริการเพิ่มเติม',
    'efficiency.extraCapacityHint': '+{n} ลูกค้า/เดือน',
    'efficiency.capacityIncrease': 'เพิ่มศักยภาพ',
    'efficiency.capacityIncreaseHint': 'ปริมาณงานทีมที่เพิ่มขึ้น',
    'efficiency.estimatedValue': 'มูลค่าประเมิน',
    'efficiency.estimatedValueHint': 'มูลค่าทางการเงินของเวลาที่ได้คืน',

    // Chart labels
    'chart.currentSystem': 'ระบบปัจจุบัน',
    'chart.aiRudder': 'AI Rudder',
    'chart.month': 'เดือน {n}',

    // Modal titles and messages
    'modal.saveTitle': 'บันทึกสถานการณ์',
    'modal.saveMsg': 'ตั้งชื่อสถานการณ์นี้:',
    'modal.savePlaceholder': 'ชื่อสถานการณ์',
    'modal.loadTitle': 'โหลดสถานการณ์',
    'modal.loadMsg': 'โหลดสถานการณ์ "{name}"? ข้อมูลปัจจุบันจะถูกแทนที่',
    'modal.deleteTitle': 'ลบสถานการณ์',
    'modal.deleteMsg': 'คุณแน่ใจว่าต้องการลบ "{name}"? การดำเนินการนี้ไม่สามารถย้อนกลับได้',

    // Toast messages
    'toast.enterName': 'กรุณาใส่ชื่อสถานการณ์',
    'toast.scenarioSaved': 'บันทึกสถานการณ์ "{name}" แล้ว',
    'toast.saveFailed': 'ไม่สามารถบันทึกสถานการณ์ได้',
    'toast.selectFirst': 'เลือกสถานการณ์จากรายการก่อน',
    'toast.scenarioLoaded': 'โหลดสถานการณ์ "{name}" แล้ว',
    'toast.loadFailed': 'ไม่สามารถโหลดสถานการณ์ได้',
    'toast.scenarioDeleted': 'ลบสถานการณ์ "{name}" แล้ว',
    'toast.deleteFailed': 'ไม่สามารถลบสถานการณ์ได้',

    // Misc
    'misc.selectScenario': 'เลือกสถานการณ์...',
    'misc.removeChannel': 'ลบช่องทาง',
    'misc.remove': 'ลบ',
    'misc.noChannels': 'เพิ่มช่องทางด้านบนเพื่อดูอัตรา',
    'misc.noCostItems': 'ยังไม่มีรายการค่าใช้จ่าย',
    'misc.na': 'N/A',
    'misc.placeholder.channelName': 'เช่น สายขาเข้า',
    'misc.placeholder.costName': 'ชื่อรายการ',

    // Header
    'header.title': 'เครื่องคิดเลขต้นทุน',
    'header.subtitle': 'วิเคราะห์ ROI เชิงโต้ตอบสำหรับการขายร่วมกัน'
  }
};

let currentLang = (typeof localStorage !== 'undefined' && localStorage.getItem('calcLang')) || 'en';

/**
 * Get translated string for a key
 * @param {string} key - Translation key
 * @returns {string} - Translated string, or key if not found
 */
export function t(key) {
  const dict = translations[currentLang] || translations.en;
  return dict[key] || translations.en[key] || key;
}

/**
 * Set the UI language and persist to localStorage
 * @param {string} lang - 'en' or 'th'
 */
export function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'th') return;
  currentLang = lang;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('calcLang', lang);
  }
}

/**
 * Get the current UI language
 * @returns {string} - 'en' or 'th'
 */
export function getLanguage() {
  return currentLang;
}

/**
 * Translate all static HTML elements with data-i18n attributes.
 * Supports:
 *   data-i18n        → sets textContent
 *   data-i18n-placeholder → sets placeholder attribute
 *   data-i18n-title  → sets title attribute
 */
export function translatePage() {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
}
