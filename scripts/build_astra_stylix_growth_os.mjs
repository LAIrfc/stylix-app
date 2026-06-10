import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const outputDir = "/Users/aela/Desktop/stylix-latest/outputs/astra-stylix-growth-os";
const outputPath = `${outputDir}/ASTRA_STYLIX_Growth_Operating_System.xlsx`;

const brand = {
  navy: "#111827",
  champagne: "#D8B56D",
  pearl: "#F8F5EF",
  jade: "#2F6F73",
  rose: "#B76E79",
  ink: "#1F2937",
  soft: "#FBFAF7",
  line: "#E7E0D3",
  white: "#FFFFFF",
};

const workbook = Workbook.create();

function ws(name) {
  const sheet = workbook.worksheets.add(name);
  sheet.showGridlines = false;
  return sheet;
}

function range(sheet, addr) {
  return sheet.getRange(addr);
}

function setValues(sheet, addr, values) {
  range(sheet, addr).values = values;
}

function setFormulas(sheet, addr, formulas) {
  range(sheet, addr).formulas = formulas;
}

function styleTitle(sheet, addr, title, subtitle) {
  const r = range(sheet, addr);
  r.merge();
  r.values = [[title]];
  r.format.fill.color = brand.navy;
  r.format.font.color = brand.white;
  r.format.font.bold = true;
  r.format.font.size = 18;
  r.format.horizontalAlignment = "Center";
  r.format.verticalAlignment = "Middle";
  const sub = range(sheet, addr.replace(/\d+:\w+\d+/, "2:2"));
  if (subtitle) {
    sub.merge();
    sub.values = [[subtitle]];
    sub.format.fill.color = brand.pearl;
    sub.format.font.color = brand.ink;
    sub.format.font.italic = true;
    sub.format.horizontalAlignment = "Center";
  }
}

function styleHeader(sheet, addr) {
  const r = range(sheet, addr);
  r.format.fill.color = brand.jade;
  r.format.font.color = brand.white;
  r.format.font.bold = true;
  r.format.horizontalAlignment = "Center";
  r.format.verticalAlignment = "Middle";
  r.format.wrapText = true;
}

function styleTable(sheet, addr) {
  const r = range(sheet, addr);
  r.format.fill.color = brand.white;
  r.format.font.color = brand.ink;
  r.format.borders.color = brand.line;
  r.format.borders.lineStyle = "Continuous";
  r.format.verticalAlignment = "Top";
}

function styleBand(sheet, addr, color = brand.champagne) {
  const r = range(sheet, addr);
  r.format.fill.color = color;
  r.format.font.color = color === brand.navy ? brand.white : brand.ink;
  r.format.font.bold = true;
}

function widths(sheet, cols) {
  for (const [col, px] of Object.entries(cols)) {
    sheet.getRange(`${col}:${col}`).format.columnWidthPx = px;
  }
}

function freeze(sheet, row = 3) {
  sheet.freezePanes.freezeRows(row);
}

const daily = ws("Daily Checklist");
styleTitle(daily, "A1:H1", "ASTRA STYLIX Daily Growth Checklist", "Daily operating rhythm for Instagram-led luxury jewelry growth, Beijing Time");
setValues(daily, "A4:H4", [["Time", "Channel", "Task", "Volume Target", "Quality Standard", "Owner", "Status", "Notes"]]);
setValues(daily, "A5:H15", [
  ["08:00", "Instagram", "Check notifications", "All new notifications", "Prioritize comments, mentions, tags, collab requests", "Growth Manager", "Not Started", ""],
  ["08:10", "Instagram", "Reply to comments", "100% within 24h", "Warm, specific, brand-aligned, no generic replies", "Growth Manager", "Not Started", ""],
  ["08:25", "Instagram", "Reply to DMs", "100% qualified DMs", "Move buying questions toward website, appointment, or concierge flow", "Growth Manager", "Not Started", ""],
  ["08:45", "Instagram", "Like posts from jewelry and fashion accounts", "50 likes", "Prioritize aspirational customers, stylists, editors, creators, bridal, luxury fashion", "Growth Manager", "Not Started", ""],
  ["09:15", "Instagram", "Leave meaningful comments", "20 comments", "Specific, human, tasteful; avoid sales language", "Growth Manager", "Not Started", ""],
  ["19:00", "Instagram Reels", "Publish first Reel", "1 Reel", "Luxury hook in first 2 seconds; product, craft, styling, or founder angle", "Growth Manager", "Not Started", ""],
  ["19:05", "Instagram", "Engage with audience", "30 minutes", "Reply fast, pin best comment, answer buying questions, follow warm leads", "Growth Manager", "Not Started", ""],
  ["20:00", "Instagram Stories", "Publish Story", "1 Story set", "Use poll, question, link, countdown, behind-the-scenes, or social proof", "Growth Manager", "Not Started", ""],
  ["21:00", "Instagram Reels", "Publish second Reel", "1 Reel", "Different angle from first Reel; test hook, format, or audience segment", "Growth Manager", "Not Started", ""],
  ["21:15", "Instagram", "Like more posts", "50 likes", "Engage accounts that match ICP and recent commenters/viewers", "Growth Manager", "Not Started", ""],
  ["21:40", "Instagram", "Leave more meaningful comments", "20 comments", "Reference the actual post; never spam; keep the brand voice refined", "Growth Manager", "Not Started", ""],
]);
styleHeader(daily, "A4:H4");
styleTable(daily, "A5:H15");
widths(daily, { A: 80, B: 130, C: 220, D: 135, E: 360, F: 140, G: 120, H: 260 });
freeze(daily, 4);

const weekly = ws("Weekly Checklist");
styleTitle(weekly, "A1:H1", "ASTRA STYLIX Weekly Growth Checklist", "Cadence for creative testing, audience learning, conversion review, and luxury brand discipline");
setValues(weekly, "A4:H4", [["Day", "Focus", "Checklist Item", "Target", "Output", "Owner", "Status", "Notes"]]);
setValues(weekly, "A5:H19", [
  ["Monday", "Planning", "Review prior week KPIs", "Followers, reach, Reel views, saves, visits, clicks, orders", "Weekly scorecard updated", "Growth Manager", "Not Started", ""],
  ["Monday", "Planning", "Choose 3 creative hypotheses", "Hooks, product angles, styling moments, audience segments", "Experiment plan", "Growth Manager", "Not Started", ""],
  ["Tuesday", "Creative", "Batch script and shot list", "14 Reels + 7 Stories", "Content pipeline", "Creative Lead", "Not Started", ""],
  ["Wednesday", "Community", "Identify high-value accounts", "50 stylists/editors/creators/customers", "Prospect engagement list", "Growth Manager", "Not Started", ""],
  ["Thursday", "Optimization", "Audit top and bottom Reels", "Top 3 / bottom 3 by views, saves, profile visits", "Learning notes", "Growth Manager", "Not Started", ""],
  ["Friday", "Conversion", "Review website-click and order path", "DMs, profile links, product pages, checkout friction", "Conversion fixes", "Growth Manager", "Not Started", ""],
  ["Friday", "Luxury Brand", "Check visual grid quality", "Color, crops, product clarity, captions, tone", "Grid quality pass", "Creative Lead", "Not Started", ""],
  ["Saturday", "Influence", "Outreach to creators/stylists", "10 personalized messages", "Collab pipeline", "Growth Manager", "Not Started", ""],
  ["Sunday", "Reflection", "Archive best comments/DMs as voice-of-customer", "10 insights", "VOC library", "Growth Manager", "Not Started", ""],
  ["Sunday", "Scheduling", "Schedule next week assets", "14 Reels + daily Stories", "Publishing queue", "Growth Manager", "Not Started", ""],
  ["Weekly", "Reporting", "Update KPI dashboard", "All daily rows entered", "Dashboard refreshed", "Growth Manager", "Not Started", ""],
  ["Weekly", "Inventory Signal", "Flag content-driven product demand", "Top products by DMs/clicks/orders", "Demand notes", "Growth Manager", "Not Started", ""],
  ["Weekly", "Partnerships", "Review inbound collab requests", "All qualified leads", "Accept / nurture / decline list", "Founder", "Not Started", ""],
  ["Weekly", "Customer Care", "Review unresolved DMs", "Zero warm buying DMs unanswered", "Follow-up list", "Growth Manager", "Not Started", ""],
  ["Weekly", "Learning", "Document what worked", "3 wins, 3 misses, 3 next tests", "Growth memo", "Growth Manager", "Not Started", ""],
]);
styleHeader(weekly, "A4:H4");
styleTable(weekly, "A5:H19");
widths(weekly, { A: 90, B: 130, C: 260, D: 280, E: 190, F: 130, G: 120, H: 240 });
freeze(weekly, 4);

const monthly = ws("Monthly Checklist");
styleTitle(monthly, "A1:H1", "ASTRA STYLIX Monthly Growth Checklist", "Strategic review for brand equity, audience growth, content economics, and commerce conversion");
setValues(monthly, "A4:H4", [["Week", "Area", "Checklist Item", "Target", "Decision / Output", "Owner", "Status", "Notes"]]);
setValues(monthly, "A5:H16", [
  ["Week 1", "KPI Review", "Review monthly performance", "All tracked KPIs vs prior month", "Monthly growth report", "Growth Manager", "Not Started", ""],
  ["Week 1", "Audience", "Analyze follower quality", "Top cities, age, gender, interests, buyer signals", "ICP refinement", "Growth Manager", "Not Started", ""],
  ["Week 1", "Content", "Rank creative formats", "Top 10 Reels by saves, reach, profile visits, orders", "Scale / stop list", "Creative Lead", "Not Started", ""],
  ["Week 2", "Brand", "Audit luxury consistency", "Visuals, copy, service tone, grid, Stories highlights", "Brand QA notes", "Founder", "Not Started", ""],
  ["Week 2", "Commerce", "Review website conversion", "Clicks to orders, best product paths, checkout issues", "Conversion action list", "Growth Manager", "Not Started", ""],
  ["Week 2", "Community", "Review VIP prospects", "Stylists, creators, repeat commenters, warm DMs", "Relationship map", "Growth Manager", "Not Started", ""],
  ["Week 3", "Campaigns", "Plan next launch/theme", "Collection, drop, gift guide, bridal, seasonal, event", "Campaign brief", "Founder", "Not Started", ""],
  ["Week 3", "Collabs", "Select creator/stylist partners", "3-5 aligned partners", "Partnership shortlist", "Growth Manager", "Not Started", ""],
  ["Week 4", "Forecast", "Set next month targets", "Followers, reach, views, saves, visits, clicks, orders", "Target sheet updated", "Growth Manager", "Not Started", ""],
  ["Week 4", "Creative Ops", "Build monthly content calendar", "60 Reels, daily Stories, launch moments", "Publishing calendar", "Creative Lead", "Not Started", ""],
  ["Week 4", "Retention", "Review customer content and reviews", "UGC, testimonials, unboxings, post-purchase DMs", "Social proof library", "Growth Manager", "Not Started", ""],
  ["Monthly", "Executive", "Founder review", "What to scale, pause, hire, spend, or automate", "Decision log", "Founder", "Not Started", ""],
]);
styleHeader(monthly, "A4:H4");
styleTable(monthly, "A5:H16");
widths(monthly, { A: 95, B: 130, C: 260, D: 280, E: 210, F: 130, G: 120, H: 250 });
freeze(monthly, 4);

const cal = ws("Calendar Events");
styleTitle(cal, "A1:J1", "Google Calendar Recurring Events", "Import-ready event structure. Time zone: Asia/Shanghai. Recurrence uses daily RRULE.");
setValues(cal, "A4:J4", [["Event", "Start Time", "End Time", "Time Zone", "Frequency", "RRULE", "Description", "Reminder 1", "Reminder 2", "Owner"]]);
setValues(cal, "A5:J10", [
  ["AM Instagram Community Sprint", "08:00", "09:45", "Asia/Shanghai", "Daily", "RRULE:FREQ=DAILY", "Check notifications, reply comments, reply DMs, like 50 jewelry/fashion posts, leave 20 meaningful comments.", "10 minutes before", "At time of event", "ASTRA STYLIX Growth Manager"],
  ["Publish First Reel + Engage", "19:00", "19:35", "Asia/Shanghai", "Daily", "RRULE:FREQ=DAILY", "Publish first Reel, then engage with audience for 30 minutes.", "15 minutes before", "At time of event", "ASTRA STYLIX Growth Manager"],
  ["Publish Daily Story", "20:00", "20:10", "Asia/Shanghai", "Daily", "RRULE:FREQ=DAILY", "Publish one Story set with interactive sticker or link.", "10 minutes before", "At time of event", "ASTRA STYLIX Growth Manager"],
  ["Publish Second Reel + PM Engagement", "21:00", "22:00", "Asia/Shanghai", "Daily", "RRULE:FREQ=DAILY", "Publish second Reel, like 50 more jewelry/fashion posts, leave 20 more meaningful comments.", "15 minutes before", "At time of event", "ASTRA STYLIX Growth Manager"],
  ["Weekly Growth Review", "10:00", "11:00", "Asia/Shanghai", "Weekly Monday", "RRULE:FREQ=WEEKLY;BYDAY=MO", "Review previous week KPIs, creative learnings, conversion signals, and next tests.", "1 hour before", "10 minutes before", "ASTRA STYLIX Growth Manager"],
  ["Monthly Growth Board", "10:00", "11:30", "Asia/Shanghai", "Monthly 1st", "RRULE:FREQ=MONTHLY;BYMONTHDAY=1", "Review monthly KPIs, brand quality, conversion path, and next month growth targets.", "1 day before", "1 hour before", "Founder + Growth Manager"],
]);
styleHeader(cal, "A4:J4");
styleTable(cal, "A5:J10");
widths(cal, { A: 220, B: 90, C: 90, D: 130, E: 115, F: 210, G: 420, H: 130, I: 130, J: 190 });
freeze(cal, 4);

const notion = ws("Notion Dashboard");
styleTitle(notion, "A1:I1", "Notion Dashboard Blueprint", "Create these databases/views in Notion, or paste the rows as tables.");
setValues(notion, "A4:I4", [["Database / View", "Property", "Type", "Options / Formula", "Purpose", "Default View", "Update Cadence", "Owner", "Notes"]]);
setValues(notion, "A5:I24", [
  ["Daily Growth Command", "Date", "Date", "Today", "Daily operating record", "Today", "Daily", "Growth Manager", ""],
  ["Daily Growth Command", "AM Checklist Complete", "Checkbox", "Notifications, comments, DMs, 50 likes, 20 comments", "Morning execution quality", "Today", "Daily", "Growth Manager", ""],
  ["Daily Growth Command", "PM Checklist Complete", "Checkbox", "First Reel, Story, second Reel, 50 likes, 20 comments", "Evening execution quality", "Today", "Daily", "Growth Manager", ""],
  ["Daily Growth Command", "Followers", "Number", "Daily ending follower count", "Audience growth", "KPI Table", "Daily", "Growth Manager", ""],
  ["Daily Growth Command", "Reach", "Number", "Instagram reach", "Top-of-funnel distribution", "KPI Table", "Daily", "Growth Manager", ""],
  ["Daily Growth Command", "Reel Views", "Number", "Combined daily Reel views", "Creative resonance", "KPI Table", "Daily", "Growth Manager", ""],
  ["Daily Growth Command", "Saves", "Number", "Daily saves", "Luxury intent signal", "KPI Table", "Daily", "Growth Manager", ""],
  ["Daily Growth Command", "Profile Visits", "Number", "Daily profile visits", "Interest quality", "KPI Table", "Daily", "Growth Manager", ""],
  ["Daily Growth Command", "Website Clicks", "Number", "Daily link clicks", "Commerce intent", "KPI Table", "Daily", "Growth Manager", ""],
  ["Daily Growth Command", "Orders", "Number", "Daily orders attributed/observed", "Revenue outcome", "KPI Table", "Daily", "Growth Manager", ""],
  ["Content Pipeline", "Content ID", "Text", "R001, R002, S001", "Asset tracking", "Board by Status", "Daily", "Creative Lead", ""],
  ["Content Pipeline", "Format", "Select", "Reel, Story, Carousel, Live", "Creative mix", "Calendar", "Daily", "Creative Lead", ""],
  ["Content Pipeline", "Angle", "Select", "Product, Craft, Styling, Founder, Social Proof, Gift, Bridal", "Creative hypothesis", "Board by Angle", "Weekly", "Growth Manager", ""],
  ["Content Pipeline", "Status", "Select", "Idea, Scripted, Shot, Edited, Scheduled, Published, Learned", "Production state", "Board by Status", "Daily", "Creative Lead", ""],
  ["Content Pipeline", "Publish Time", "Date", "Asia/Shanghai", "Scheduling", "Calendar", "Daily", "Growth Manager", ""],
  ["Experiment Log", "Hypothesis", "Text", "If we lead with X, then Y should improve", "Learning system", "Table", "Weekly", "Growth Manager", ""],
  ["Experiment Log", "Primary KPI", "Select", "Reach, Views, Saves, Visits, Clicks, Orders", "Success metric", "Table", "Weekly", "Growth Manager", ""],
  ["Experiment Log", "Result", "Select", "Win, Inconclusive, Loss", "Decision support", "Table", "Weekly", "Growth Manager", ""],
  ["VIP Community CRM", "Account", "Text", "Instagram handle", "Relationship map", "VIP List", "Weekly", "Growth Manager", ""],
  ["VIP Community CRM", "Segment", "Select", "Customer, Stylist, Editor, Creator, Bridal, Retail, Press", "Prioritization", "VIP List", "Weekly", "Growth Manager", ""],
]);
styleHeader(notion, "A4:I4");
styleTable(notion, "A5:I24");
widths(notion, { A: 190, B: 190, C: 105, D: 270, E: 210, F: 140, G: 120, H: 150, I: 180 });
freeze(notion, 4);

const tracker = ws("Daily Tracker");
styleTitle(tracker, "A1:Q1", "ASTRA STYLIX Daily KPI Tracker", "Enter daily metrics here. Dashboard, weekly, and monthly summaries calculate from this sheet.");
setValues(tracker, "A4:Q4", [["Date", "Day", "AM Done", "PM Done", "Followers", "Reach", "Reel Views", "Saves", "Profile Visits", "Website Clicks", "Orders", "New Followers", "Save Rate", "Profile Visit Rate", "Website CTR", "Order Conversion", "Notes"]]);
const start = new Date(Date.UTC(2026, 5, 7));
const rows = [];
for (let i = 0; i < 31; i++) {
  const d = new Date(start.getTime() + i * 86400000);
  const iso = d.toISOString().slice(0, 10);
  rows.push([iso, `=TEXT(A${5 + i},"ddd")`, "", "", "", "", "", "", "", "", "", `=IF(E${5 + i}="","",E${5 + i}-IFERROR(LOOKUP(2,1/($E$5:E${4 + i}<>""),$E$5:E${4 + i}),E${5 + i}))`, `=IFERROR(H${5 + i}/G${5 + i},"")`, `=IFERROR(I${5 + i}/F${5 + i},"")`, `=IFERROR(J${5 + i}/I${5 + i},"")`, `=IFERROR(K${5 + i}/J${5 + i},"")`, ""]);
}
setValues(tracker, "A5:Q35", rows);
styleHeader(tracker, "A4:Q4");
styleTable(tracker, "A5:Q35");
range(tracker, "A5:A35").numberFormat = "yyyy-mm-dd";
range(tracker, "E5:L35").numberFormat = "#,##0";
range(tracker, "M5:P35").numberFormat = "0.0%";
widths(tracker, { A: 105, B: 70, C: 90, D: 90, E: 105, F: 105, G: 115, H: 90, I: 120, J: 115, K: 85, L: 110, M: 95, N: 125, O: 95, P: 120, Q: 260 });
freeze(tracker, 4);

const weeklyData = ws("Weekly Summary");
styleTitle(weeklyData, "A1:M1", "Weekly KPI Summary", "Formula-backed weekly rollup from the Daily Tracker.");
setValues(weeklyData, "A4:M4", [["Week Start", "Week End", "Followers End", "New Followers", "Reach", "Reel Views", "Saves", "Profile Visits", "Website Clicks", "Orders", "Save Rate", "Website CTR", "Order Conversion"]]);
const weeklyRows = [];
for (let i = 0; i < 5; i++) {
  const row = 5 + i;
  const srow = 5 + i * 7;
  const erow = Math.min(11 + i * 7, 35);
  weeklyRows.push([
    `='Daily Tracker'!A${srow}`,
    `='Daily Tracker'!A${erow}`,
    `=IFERROR(LOOKUP(2,1/('Daily Tracker'!E${srow}:E${erow}<>""),'Daily Tracker'!E${srow}:E${erow}),"")`,
    `=SUM('Daily Tracker'!L${srow}:L${erow})`,
    `=SUM('Daily Tracker'!F${srow}:F${erow})`,
    `=SUM('Daily Tracker'!G${srow}:G${erow})`,
    `=SUM('Daily Tracker'!H${srow}:H${erow})`,
    `=SUM('Daily Tracker'!I${srow}:I${erow})`,
    `=SUM('Daily Tracker'!J${srow}:J${erow})`,
    `=SUM('Daily Tracker'!K${srow}:K${erow})`,
    `=IFERROR(G${row}/F${row},"")`,
    `=IFERROR(I${row}/H${row},"")`,
    `=IFERROR(J${row}/I${row},"")`,
  ]);
}
setFormulas(weeklyData, "A5:M9", weeklyRows);
styleHeader(weeklyData, "A4:M4");
styleTable(weeklyData, "A5:M9");
range(weeklyData, "A5:B9").numberFormat = "yyyy-mm-dd";
range(weeklyData, "C5:J9").numberFormat = "#,##0";
range(weeklyData, "K5:M9").numberFormat = "0.0%";
widths(weeklyData, { A: 105, B: 105, C: 110, D: 115, E: 105, F: 115, G: 90, H: 120, I: 115, J: 85, K: 90, L: 95, M: 120 });
freeze(weeklyData, 4);

const monthlyData = ws("Monthly Summary");
styleTitle(monthlyData, "A1:M1", "Monthly KPI Summary", "Monthly rollup from the Daily Tracker.");
setValues(monthlyData, "A4:M4", [["Month", "Followers End", "New Followers", "Reach", "Reel Views", "Saves", "Profile Visits", "Website Clicks", "Orders", "Save Rate", "Profile Visit Rate", "Website CTR", "Order Conversion"]]);
setFormulas(monthlyData, "A5:M5", [[
  `=TEXT(MIN('Daily Tracker'!A5:A35),"mmmm yyyy")`,
  `=IFERROR(LOOKUP(2,1/('Daily Tracker'!E5:E35<>""),'Daily Tracker'!E5:E35),"")`,
  `=SUM('Daily Tracker'!L5:L35)`,
  `=SUM('Daily Tracker'!F5:F35)`,
  `=SUM('Daily Tracker'!G5:G35)`,
  `=SUM('Daily Tracker'!H5:H35)`,
  `=SUM('Daily Tracker'!I5:I35)`,
  `=SUM('Daily Tracker'!J5:J35)`,
  `=SUM('Daily Tracker'!K5:K35)`,
  `=IFERROR(F5/E5,"")`,
  `=IFERROR(G5/D5,"")`,
  `=IFERROR(H5/G5,"")`,
  `=IFERROR(I5/H5,"")`,
]]);
styleHeader(monthlyData, "A4:M4");
styleTable(monthlyData, "A5:M5");
range(monthlyData, "B5:I5").numberFormat = "#,##0";
range(monthlyData, "J5:M5").numberFormat = "0.0%";
widths(monthlyData, { A: 130, B: 110, C: 115, D: 105, E: 115, F: 90, G: 120, H: 115, I: 85, J: 90, K: 125, L: 95, M: 120 });
freeze(monthlyData, 4);

const dash = ws("KPI Dashboard");
styleTitle(dash, "A1:L1", "ASTRA STYLIX KPI Dashboard", "Luxury jewelry Instagram growth pulse: audience, attention, intent, and orders.");
setValues(dash, "A4:D4", [["KPI", "Current Month", "Target", "Status"]]);
setValues(dash, "A5:A11", [["Followers"], ["Reach"], ["Reel Views"], ["Saves"], ["Profile Visits"], ["Website Clicks"], ["Orders"]]);
setFormulas(dash, "B5:B11", [
  [`='Monthly Summary'!B5`],
  [`='Monthly Summary'!D5`],
  [`='Monthly Summary'!E5`],
  [`='Monthly Summary'!F5`],
  [`='Monthly Summary'!G5`],
  [`='Monthly Summary'!H5`],
  [`='Monthly Summary'!I5`],
]);
setValues(dash, "C5:C11", [[5000], [100000], [150000], [5000], [2500], [500], [30]]);
setFormulas(dash, "D5:D11", [
  [`=IF(B5="","No data",IF(B5>=C5,"On Track","Needs Focus"))`],
  [`=IF(B6="","No data",IF(B6>=C6,"On Track","Needs Focus"))`],
  [`=IF(B7="","No data",IF(B7>=C7,"On Track","Needs Focus"))`],
  [`=IF(B8="","No data",IF(B8>=C8,"On Track","Needs Focus"))`],
  [`=IF(B9="","No data",IF(B9>=C9,"On Track","Needs Focus"))`],
  [`=IF(B10="","No data",IF(B10>=C10,"On Track","Needs Focus"))`],
  [`=IF(B11="","No data",IF(B11>=C11,"On Track","Needs Focus"))`],
]);
styleHeader(dash, "A4:D4");
styleTable(dash, "A5:D11");
styleBand(dash, "F4:L4", brand.champagne);
setValues(dash, "F4:L4", [["Daily Trend Source for Chart", "", "", "", "", "", ""]]);
setValues(dash, "F5:L5", [["Date", "Reach", "Reel Views", "Saves", "Profile Visits", "Website Clicks", "Orders"]]);
const trendFormulas = [];
for (let i = 0; i < 31; i++) {
  const sr = 5 + i;
  trendFormulas.push([
    `='Daily Tracker'!A${sr}`,
    `='Daily Tracker'!F${sr}`,
    `='Daily Tracker'!G${sr}`,
    `='Daily Tracker'!H${sr}`,
    `='Daily Tracker'!I${sr}`,
    `='Daily Tracker'!J${sr}`,
    `='Daily Tracker'!K${sr}`,
  ]);
}
setFormulas(dash, "F6:L36", trendFormulas);
styleHeader(dash, "F5:L5");
styleTable(dash, "F6:L36");
range(dash, "B5:C11").numberFormat = "#,##0";
range(dash, "F6:F36").numberFormat = "yyyy-mm-dd";
range(dash, "G6:L36").numberFormat = "#,##0";
setValues(dash, "A14:D14", [["Conversion Quality", "Current", "Benchmark", "Read"]]);
setValues(dash, "A15:A18", [["Save Rate"], ["Profile Visit Rate"], ["Website CTR"], ["Order Conversion"]]);
setFormulas(dash, "B15:B18", [[`='Monthly Summary'!J5`], [`='Monthly Summary'!K5`], [`='Monthly Summary'!L5`], [`='Monthly Summary'!M5`]]);
setValues(dash, "C15:C18", [[0.03], [0.02], [0.2], [0.06]]);
setFormulas(dash, "D15:D18", [
  [`=IF(B15="","No data",IF(B15>=C15,"Strong","Watch"))`],
  [`=IF(B16="","No data",IF(B16>=C16,"Strong","Watch"))`],
  [`=IF(B17="","No data",IF(B17>=C17,"Strong","Watch"))`],
  [`=IF(B18="","No data",IF(B18>=C18,"Strong","Watch"))`],
]);
styleHeader(dash, "A14:D14");
styleTable(dash, "A15:D18");
range(dash, "B15:C18").numberFormat = "0.0%";
widths(dash, { A: 150, B: 125, C: 100, D: 120, E: 28, F: 105, G: 105, H: 115, I: 90, J: 120, K: 115, L: 85 });
freeze(dash, 4);

try {
  const chart = dash.charts.add("Line", range(dash, "F5:L36"));
  chart.setPosition("F14", "L29");
  chart.title.text = "Daily Reach, Reel Views, Intent, and Orders";
} catch {
  setValues(dash, "F14:L14", [["Chart area: select F5:L36 and insert a line chart if your Excel viewer does not auto-render charts.", "", "", "", "", "", ""]]);
  styleBand(dash, "F14:L14", brand.pearl);
}

const sheets = [daily, weekly, monthly, cal, notion, tracker, weeklyData, monthlyData, dash];
for (const sheet of sheets) {
  sheet.getUsedRange().format.font.name = "Aptos";
  sheet.getUsedRange().format.font.size = 10;
  sheet.getUsedRange().format.wrapText = true;
}

await fs.mkdir(outputDir, { recursive: true });

const errorScan = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(errorScan.ndjson);

for (const sheetName of ["KPI Dashboard", "Daily Checklist", "Daily Tracker", "Calendar Events", "Notion Dashboard"]) {
  await workbook.render({ sheetName, range: "A1:L24", scale: 1 });
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);
