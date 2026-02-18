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
    'section.channels': 'Channels',
    'section.rates': 'Rates Comparison',
    'section.ratesDesc': "Compare per-interaction costs. AI Bot Rate applies to deflected interactions, AI Agent Rate to human-assisted ones.",
    'section.additionalCosts': 'Additional Costs',
    'section.additionalCostsDesc': 'Add any other operating costs not covered above',
    'section.clientState': 'Client Current State',
    'section.aiSolution': 'AI Rudder Solution',
    'section.efficiency': 'Efficiency Offset',
    'section.efficiencyDesc': 'Estimate how much AI automation reduces operational load',
    'section.dashboard': 'Dashboard',
    'section.chartTitle': '24-Month Cost Comparison',
    'section.chartDesc': 'Cumulative total costs over 24 months including channel costs, agent payroll, and additional costs. The green shaded area between the lines represents your savings with AI Rudder. Admin efficiency gains are additional savings reflected in the dashboard above.',

    // Field labels and descriptions
    'field.totalAgents': 'Total Current Agents',
    'field.totalAgentsDesc': 'Number of human agents handling customer interactions',
    'field.monthlySalary': 'Avg Monthly Salary per Agent',
    'field.monthlySalaryDesc': 'Including benefits and overhead per agent',
    'field.channelName': 'Channel Name',
    'field.channelNameDesc': 'Label shown in rates comparison',
    'field.volume': 'Volume',
    'field.volumeDesc': 'Monthly interaction count',
    'field.handleTime': 'Avg Handle Time (Minutes)',
    'field.handleTimeDesc': 'Duration per human-handled call',
    'field.aiHandleTime': 'AI Handle Time (Minutes)',
    'field.aiHandleTimeDesc': 'Average duration when AI handles a voice interaction',
    'field.deflectionRate': 'AI Deflection Rate',
    'field.deflectionRateDesc': 'Percentage of interactions fully handled by AI without human intervention',
    'field.adminHours': 'Admin Hours Saved/Month',
    'field.adminHoursDesc': 'Hours of supervisory/admin work eliminated by AI automation',
    'field.hourlyRate': 'Hourly Rate',
    'field.hourlyRateDesc': 'Cost per hour for admin/supervisory time',
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
    'rates.channel': 'Channel',
    'rates.clientRate': 'Client Rate',
    'rates.aiBotRate': "AI Rudder's Bot Call Rates",
    'rates.aiAgentRate': 'AI Rudder Call Rates',

    // Dashboard metric labels and hints
    'metric.currentMonthly': 'Current Monthly Spend',
    'metric.currentMonthlyHint': 'Channel costs + agent payroll + additional costs',
    'metric.aiMonthly': 'AI Rudder Monthly Spend',
    'metric.aiMonthlyHint': 'Channel costs + retained payroll + additional costs',
    'metric.monthlySavings': 'Monthly Savings',
    'metric.monthlySavingsHint': 'Total reduction including admin efficiency',
    'metric.costReduction': 'Cost Reduction',
    'metric.costReductionHint': 'Percentage of current spend saved monthly',
    'metric.initialInvestment': 'Initial Investment',
    'metric.initialInvestmentHint': 'One-time setup costs',
    'metric.breakEven': 'Break-Even',
    'metric.breakEvenHint': 'When cumulative savings exceed investment',
    'metric.year1Savings': 'Year 1 Net Savings',
    'metric.year1SavingsHint': '12 months of savings minus initial investment',

    // Derived metrics (efficiency offset)
    'derived.agentsReplaced': 'Agents Replaced',
    'derived.trafficToAI': 'Traffic Routed to AI',
    'derived.payrollSaved': 'Payroll Saved',
    'derived.adminValue': 'Admin Value Reclaimed',

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
    'section.clientOpsDesc': 'อธิบายการดำเนินงานปัจจุบันของลูกค้า',
    'section.channels': 'ช่องทาง',
    'section.rates': 'เปรียบเทียบอัตรา',
    'section.ratesDesc': 'เปรียบเทียบต้นทุนต่อการโต้ตอบ อัตรา AI Bot ใช้สำหรับการโต้ตอบที่ AI จัดการ อัตรา AI Agent ใช้สำหรับการโต้ตอบที่มีเจ้าหน้าที่ช่วย',
    'section.additionalCosts': 'ค่าใช้จ่ายเพิ่มเติม',
    'section.additionalCostsDesc': 'เพิ่มค่าใช้จ่ายดำเนินงานอื่นๆ ที่ยังไม่ได้ระบุข้างต้น',
    'section.clientState': 'สถานะปัจจุบันของลูกค้า',
    'section.aiSolution': 'โซลูชัน AI Rudder',
    'section.efficiency': 'ประสิทธิภาพที่เพิ่มขึ้น',
    'section.efficiencyDesc': 'ประเมินว่า AI ช่วยลดภาระการดำเนินงานได้มากเพียงใด',
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
    'field.aiHandleTimeDesc': 'ระยะเวลาเฉลี่ยเมื่อ AI จัดการสายเสียง',
    'field.deflectionRate': 'อัตรา AI Deflection',
    'field.deflectionRateDesc': 'เปอร์เซ็นต์ของการโต้ตอบที่ AI จัดการได้ทั้งหมดโดยไม่ต้องมีเจ้าหน้าที่',
    'field.adminHours': 'ชั่วโมง Admin ที่ประหยัด/เดือน',
    'field.adminHoursDesc': 'ชั่วโมงงานดูแล/บริหารที่ลดลงจาก AI',
    'field.hourlyRate': 'อัตราต่อชั่วโมง',
    'field.hourlyRateDesc': 'ค่าใช้จ่ายต่อชั่วโมงสำหรับงานบริหาร/ดูแล',
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
    'metric.currentMonthly': 'ค่าใช้จ่ายรายเดือนปัจจุบัน',
    'metric.currentMonthlyHint': 'ค่าช่องทาง + เงินเดือนเจ้าหน้าที่ + ค่าใช้จ่ายเพิ่มเติม',
    'metric.aiMonthly': 'ค่าใช้จ่าย AI Rudder รายเดือน',
    'metric.aiMonthlyHint': 'ค่าช่องทาง + เงินเดือนที่เหลือ + ค่าใช้จ่ายเพิ่มเติม',
    'metric.monthlySavings': 'ประหยัดรายเดือน',
    'metric.monthlySavingsHint': 'ลดค่าใช้จ่ายรวมรวมประสิทธิภาพ Admin',
    'metric.costReduction': 'ลดต้นทุน',
    'metric.costReductionHint': 'เปอร์เซ็นต์ค่าใช้จ่ายที่ประหยัดได้ต่อเดือน',
    'metric.initialInvestment': 'เงินลงทุนเริ่มต้น',
    'metric.initialInvestmentHint': 'ค่าติดตั้งครั้งเดียว',
    'metric.breakEven': 'จุดคุ้มทุน',
    'metric.breakEvenHint': 'เมื่อเงินออมสะสมเกินเงินลงทุน',
    'metric.year1Savings': 'ประหยัดสุทธิปีที่ 1',
    'metric.year1SavingsHint': 'เงินออม 12 เดือนหักเงินลงทุนเริ่มต้น',

    // Derived metrics (efficiency offset)
    'derived.agentsReplaced': 'เจ้าหน้าที่ที่ทดแทน',
    'derived.trafficToAI': 'ปริมาณงานที่ส่งให้ AI',
    'derived.payrollSaved': 'เงินเดือนที่ประหยัด',
    'derived.adminValue': 'มูลค่า Admin ที่ได้คืน',

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
