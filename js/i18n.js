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
    'field.voiceAiHandleTimeDesc': 'Average amount of time required for a Voice Bot to handles a call',
    'field.chatAiHandleTime': 'Avg Handle Time by Chat Bot (Minutes)',
    'field.chatAiHandleTimeDesc': 'Average amount of time required for a Chat Bot to handles a chat session',
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
    'section.clientOpsDesc': 'ข้อมูลการดำเนินงานปัจจุบันของลูกค้า',
    'section.channels': 'ช่องทางการให้บริการ (โทร,แชท, SMS)',
    'section.rates': 'อัตราต้นทุนในช่องทางต่างๆ',
    'section.ratesDesc': 'เปรียบเทียบต้นทุนการให้บริการ โดย อัตราของ AI Rudder Bot หมายถึงอัตราค่าการให้บริการของ AI Rudder ที่ใช้ Bot ในสนทนา, อัตราของ AI Rudder  หมายถึงให้อัตราค่าบริการของ AI Rudderที่ให้บริหารแต่ช่องทางการให้บริการ ซึงลูกค้ายังขำเป็นต้องมีเจ้าหน้าที่ในการดำเนินการอยู่',
    'section.additionalCosts': 'ค่าใช้จ่ายเพิ่มเติม',
    'section.additionalCostsDesc': 'เพิ่มค่าใช้จ่ายการดำเนินงานอื่นๆ ที่ยังไม่ได้ระบุข้างต้น',
    'section.clientState': 'ค่าใช้จ่ายอื่นๆของลูกค้า',
    'section.aiSolution': 'ค่าใข้จ่ายเมื่อใช้ AI Rudder',
    'section.aiConfig': 'ข้อมูล AI Rudder',
    'section.aiConfigDesc': 'ข้อมูลการดำเนินงานที่เป็นไปได้ของ AI Rudder',
    'section.efficiency': 'ประสิทธิภาพเพิ่มเติม',
    'section.efficiencyDesc': 'การประเมินจำนวนเวลาที่สามารถประหยัดได้จริงจากการใช้ระบบอัตโนมัติทั้งหมดของ AI Rudder',
    'section.dashboard': 'สรุปข้อมูล',
    'section.chartTitle': 'เปรียบเทียบต้นทุน 24 เดือน',
    'section.chartDesc': 'ต้นทุนสะสมรวม 24 เดือน รวมค่าช่องทาง ค่าจ้างเจ้าหน้าที่ และค่าใช้จ่ายเพิ่มเติม พื้นที่สีเขียวระหว่างเส้นแสดงจำนวนเงินที่ประหยัดได้กับ AI Rudder ประสิทธิภาพ Admin ที่เพิ่มขึ้นจะแสดงในแดชบอร์ดด้านบน',

    // Field labels and descriptions
    'field.totalAgents': 'จำนวนเจ้าหน้าที่ปัจจุบัน',
    'field.totalAgentsDesc': 'จำนวนเจ้าหน้าที่ให้บริการลูกค้า',
    'field.monthlySalary': 'เงินเดือนเฉลี่ยต่อเจ้าหน้าที่ 1 คน',
    'field.monthlySalaryDesc': 'รวมสวัสดิการและค่าใช้จ่ายต่อเจ้าหน้าที่',
    'field.channelName': 'ชื่อช่องทางการให้บริการ',
    'field.channelNameDesc': 'ตัวอย่าง: Agent Calling',
    'field.volume': 'ปริมาณ (ต่อเดือน)',
    'field.volumeDesc': 'จำนวนรอบในการให้บริการ',
    'field.handleTime': 'เวลาเฉลี่ยที่เจ้าหน้าที่ใช้ในการให้บริการ (นาที)',
    'field.handleTimeDesc': 'เวลาเฉลี่ยที่เจ้าหน้าที่ใช้ในการคุย ต่อสาย',
    'field.aiHandleTime': 'เวลาเฉลี่ยที่ Bot ใช้ในการให้บริการ (นาที)',
    'field.aiHandleTimeDesc': 'เวลาเฉลี่ยที่ Bot ใช้ในการให้บริการด้วยเสียง/แชท',
    'field.voiceAiHandleTime': 'เวลาเฉลี่ยที่ Voice Bot ใช้ในการให้บริการ(นาที)',
    'field.voiceAiHandleTimeDesc': 'เวลาเฉลี่ยที่ Voice Bot ใช้ในการโทรคุยกับลูกค้า ใน 1 สาย',
    'field.chatAiHandleTime': 'เวลาเฉลี่ยที่ Chat Bot ใช้ในการให้บริการ (นาที)',
    'field.chatAiHandleTimeDesc': 'เวลาเฉลี่ยที่ Chat Bot ใช้ในการคุยแชทกับลูกค้า ต่อ 1 session',
    'field.deflectionRate': 'อัตราการทำงานของ Bot เหมือนเทียบกับงานทั้งหมดที่ทีมให้บริการต้องทำ',
    'field.deflectionRateDesc': 'อัตราการให้บริการของ Bot โดยไม่ต้องมีเจ้าหน้าที่',
    'field.adminHours': 'จำนวนเวลาที่สามารถประหยัดได้จริงจากการมีระบบ AI Rudder (ชั่วโมง)',
    'field.adminHoursDesc': 'จำนวนเวลาทั้งหมด ต่อเดือนที่ระบบอัตโนมัติจาก AI Rudder สามารถช่วยลด เช่น โทรอัตโนมัติ จัดการคิว งานบริหาร',
    'field.chatHandleTime': 'เวลาเฉลี่ยที่เจ้าหน้าที่ใช้ในการให้บริการ (นาที)',
    'field.chatHandleTimeDesc': 'เวลาเฉลี่ยที่เจ้าหน้าที่ใช้ในการแชท ต่อ 1 session ',
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
    'rates.channel': 'ช่องทางให้บริการ',
    'rates.clientRate': 'อัตราลูกค้า',
    'rates.aiBotRate': 'อัตรา Bot AI Rudder',
    'rates.aiAgentRate': 'อัตรา AI Rudder',

    // Dashboard metric labels and hints
    'metric.currentMonthly': 'ต้นทุนดำเนินงานปัจจุบัน',
    'metric.currentMonthlyHint': 'รวมต้นทุนรายเดือน: ต้นทุนการให้บริการทุกช่องทาง + เงินเดือน + ค่าใช้จ่ายเพิ่มเติม',
    'metric.aiMonthly': 'ต้นทุนดำเนินงานโดยมีการใช้ AI Rudderเข้ามาร่วมด้วย',
    'metric.aiMonthlyHint': 'รวมต้นทุนรายเดือน: ต้นทุนการให้บริการทุกช่องทาง + เงินเดือนที่เหลือ + ค่าใช้จ่ายเพิ่มเติม',
    'metric.monthlySavings': 'ประหยัดต้นทุนไปได้ถึง',
    'metric.monthlySavingsHint': 'ต่อเดือน',
    'metric.costReduction': 'ลดต้นทุนได้ถึง',
    'metric.costReductionHint': 'ต่อเดือน เมื่อเทียบกับต้นทุนปัจจุบัน',
    'metric.initialInvestment': 'เงินลงทุนเริ่มต้นกับระบบ AI Rudder',
    'metric.initialInvestmentHint': 'ค่าติดตั้งครั้งเดียว',
    'metric.breakEven': 'ระยะเวลาที่ต้องใช้ในการคุ้มทุน',
    'metric.breakEvenHint': '(เวลาที่ใช้ในการได้เงินลงทุนกลับมาจากการประหยัดต้นทุน)',
    'metric.year1Savings': 'จำนวนเงินทั้งหมดที่สามารถประหยัดได้ในปีที่ 1 (สุทธิ)',
    'metric.year1SavingsHint': '(จำนวนเงินที่ประหยัดจากต้นทุนในเวลา 12 เดือนหักกับเงินลงทุนเริ่มต้น)',
    'metric.roi': 'ROI',
    'metric.roiHint': 'ผลตอบแทนจากเงินลงทุนเริ่มต้นกับระบบ AI Rudder ในปีที่ 1',
    'metric.perInteraction': 'เฉลี่ย {amount} ต่อการให้บริการ 1 ครั้ง',
    'metric.costComparison': 'เปรียบเทียบต้นทุน',
    'metric.directSavings': 'ข้อมูลต้นทุนที่ประหยัดได้',

    // Efficiency Gains
    'efficiency.title': 'ประสิทธิภาพที่เพิ่มขึ้น',
    'efficiency.agentsFreed': 'Bot สามารถปริมาณงานให้บริการได้เทียบเท่ากับเจ้าหน้าที่',
    'efficiency.agentsFreedHint': 'ทำให้ทีมให้บริการมีเวลาให้กับงานอื่นๆที่ต้องใช้ทักษาสูง เพราะ {pct}% งานทั้งหมดที่มีในปัจจุบันสามารถให้ Bot ทำได้อัตโนมัติ)',
    'efficiency.hoursReclaimed': 'จำนวนเวลาที่ได้กลับคืนมา',
    'efficiency.hoursReclaimedHint': '{n} ชม. ต่อ เดือน ,เทียบเท่ากับการได้เจ้าหน้าที่กลับคืนมา อีก ~{eq} คน)',
    'efficiency.extraCapacity': 'สามาถให้บริการลูกค้าเพิ่มขิ้นได้ถึง',
    'efficiency.extraCapacityHint': '+{n} ลูกค้า ต่อเดือน',
    'efficiency.capacityIncrease': 'เพิ่มศักยภาพของทีมให้บริากร',
    'efficiency.capacityIncreaseHint': 'เมื่อเทียบกับการดำเนินการปัจจุบัน',
    'efficiency.estimatedValue': 'มูลค่าโดยประเมินของเวลาที่ได้กลับคืน',
    'efficiency.estimatedValueHint': '(มูลค่าทางการเงินของเวลาที่ได้คืน)',

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
    'header.title': 'เครื่องมือวิเคราะห์ต้นทุน',
    'header.subtitle': 'วิเคราะห์ต้นทุนกับลูกค้า'
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
