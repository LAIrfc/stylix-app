import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const outputDir = "/Users/aela/Desktop/stylix-latest/outputs/astra-stylix-content-calendar";
const outputPath = `${outputDir}/ASTRA_STYLIX_30_Day_Content_Calendar.xlsx`;

const colors = {
  ink: "#111827",
  pearl: "#F8F5EF",
  ivory: "#FBFAF7",
  champagne: "#D8B56D",
  jade: "#2F6F73",
  rose: "#B76E79",
  line: "#E7E0D3",
  white: "#FFFFFF",
};

const workbook = Workbook.create();

function addSheet(name) {
  const sheet = workbook.worksheets.add(name);
  sheet.showGridlines = false;
  return sheet;
}

function r(sheet, address) {
  return sheet.getRange(address);
}

function setValues(sheet, address, values) {
  r(sheet, address).values = values;
}

function title(sheet, address, text, subtitle) {
  const main = r(sheet, address);
  main.merge();
  main.values = [[text]];
  main.format.fill.color = colors.ink;
  main.format.font.color = colors.white;
  main.format.font.bold = true;
  main.format.font.size = 18;
  main.format.horizontalAlignment = "Center";
  main.format.verticalAlignment = "Middle";
  const sub = r(sheet, "A2:O2");
  sub.merge();
  sub.values = [[subtitle]];
  sub.format.fill.color = colors.pearl;
  sub.format.font.color = colors.ink;
  sub.format.font.italic = true;
  sub.format.horizontalAlignment = "Center";
}

function header(sheet, address) {
  const h = r(sheet, address);
  h.format.fill.color = colors.jade;
  h.format.font.color = colors.white;
  h.format.font.bold = true;
  h.format.horizontalAlignment = "Center";
  h.format.verticalAlignment = "Middle";
  h.format.wrapText = true;
}

function table(sheet, address) {
  const t = r(sheet, address);
  t.format.fill.color = colors.white;
  t.format.font.color = colors.ink;
  t.format.borders.color = colors.line;
  t.format.borders.lineStyle = "Continuous";
  t.format.verticalAlignment = "Top";
  t.format.wrapText = true;
}

function widths(sheet, map) {
  for (const [col, px] of Object.entries(map)) {
    sheet.getRange(`${col}:${col}`).format.columnWidthPx = px;
  }
}

const baseHashtags = "#ASTRASTYLIX #ASTRAEdit #QuietlyStyled #QuietLuxury #MinimalJewelry #FineJewelry #EverydayJewelry";

const calendar = [
  [1, "Signature Detail", "Macro reel: zodiac pendant catching window light on bare skin, then layered over a white tank and blazer.", "7:30 PM ET", "7:30 AM BJT +1", "The detail that makes a white tank feel intentional.", "Some jewelry finishes an outfit. Some becomes the reason the outfit works. Wear the zodiac pendant alone for restraint, then layer when the day turns into dinner. Save this for your next clean uniform.", "Mirror reel: three outfits, one slim ring stack: office shirting, dark denim, black slip dress.", "9:15 PM ET", "9:15 AM BJT +1", "One ring stack, three versions of you.", "A minimal stack should feel like punctuation, not decoration. Start with one sculptural band, add one fine texture, stop before it gets loud. Shop the quiet edit.", "Poll: Gold or silver for your daily uniform? Add product link sticker.", `${baseHashtags} #CapsuleWardrobe #NYCStyle`],
  [2, "Zodiac Intimacy", "Close-up clasp sound and pendant flip: front, back, skin scale, neckline scale.", "12:15 PM ET", "12:15 AM BJT +1", "For the sign you read first, even when you say you do not.", "A zodiac piece can be personal without feeling precious. Clean lines, quiet shine, and just enough meaning to feel like yours. Send this to the friend who knows your chart.", "Creator-style voiceover: why minimalist zodiac jewelry feels more grown than novelty astrology pieces.", "8:45 PM ET", "8:45 AM BJT +1", "Astrology, but make it heirloom-coded.", "The secret is restraint: a refined symbol, a fine chain, and styling that works beyond the trend. This is zodiac jewelry for women who dress with discipline.", "Question sticker: What is your sign and your metal?", `${baseHashtags} #ZodiacJewelry #AstrologyStyle`],
  [3, "Office To Evening", "Desk-to-dinner transition: remove blazer, add earrings, touch necklace, lipstick in compact.", "7:00 PM ET", "7:00 AM BJT +1", "The fastest way to make work clothes feel like dinner plans.", "Keep the outfit simple. Let the metal do the shift. Fine hoops, a clean pendant, and a ring you notice when you reach for the glass.", "Flat lay: grey knit, black trousers, zodiac pendant, watch, soft shadow.", "9:30 PM ET", "9:30 AM BJT +1", "A quiet luxury outfit starts before the clothes.", "The best daily pieces do not ask for attention; they reward it. Build around texture, neckline, and one precise point of shine.", "Behind-the-scenes: packing tomorrow's office-to-evening jewelry tray.", `${baseHashtags} #WorkwearStyle #MinimalStyle`],
  [4, "Fine Jewelry Proof", "Macro proof reel: polish, clasp, chain movement, hand scale, no talking.", "1:00 PM ET", "1:00 AM BJT +1", "Look for the details you can feel before you buy.", "Weight, movement, and finish are the quiet signals. A piece should sit cleanly, catch light softly, and feel like it belongs to your daily life.", "Founder POV: three signs a minimal piece will actually get worn.", "8:30 PM ET", "8:30 AM BJT +1", "Pretty is not enough. It has to earn repeat wear.", "Ask: does it work with your neckline, your watch, your hands, your real calendar? That is where fine jewelry becomes a signature.", "Quiz sticker: Which proof matters most: clasp, shine, scale, weight?", `${baseHashtags} #LuxuryJewelry #JewelryDetails`],
  [5, "Weekend Uniform", "Coffee walk styling: white tee, dark denim, small hoops, pendant, hair tuck.", "10:30 AM ET", "10:30 PM BJT", "Your weekend uniform, but finished.", "A clean tee and denim become intentional when the jewelry is exact. Small hoops, a fine chain, one ring. Nothing extra. Everything considered.", "Get-ready reel: five-second cuts of jewelry going on before brunch.", "8:00 PM ET", "8:00 AM BJT +1", "The ritual is the luxury.", "The clasp, the ring, the last look in the mirror. Getting dressed for yourself is still the most persuasive styling trick.", "Story: weekend outfit mirror, link to pendant and hoops.", `${baseHashtags} #WeekendStyle #EverydayJewelry`],
  [6, "Self-Purchase", "Unboxing reel from buyer POV: box, tissue, hand on ribbon, first try-on.", "11:00 AM ET", "11:00 PM BJT", "A gift from you does not need an occasion.", "Self-purchase is not indulgence when the piece becomes part of your visual signature. Choose the one you will reach for on ordinary days.", "Text overlay reel: 'Milestones worth marking quietly' with ring, pendant, earrings.", "9:00 PM ET", "9:00 AM BJT +1", "Promotion. New apartment. Leaving what was too small.", "Not every milestone needs a speech. Some deserve a piece you can wear while becoming the next version of yourself.", "Question sticker: What are you quietly celebrating?", `${baseHashtags} #SelfGift #ModernHeirloom`],
  [7, "Sunday Reset", "Jewelry tray reset: clean pieces, line them on ivory paper, select weekly stack.", "6:30 PM ET", "6:30 AM BJT +1", "A five-minute reset for a more intentional week.", "Lay out the pieces you actually wear. Edit the rest. The right jewelry wardrobe should make Monday feel calmer before it starts.", "Zodiac pendant with book, silk, and candle, slow editorial pan.", "9:00 PM ET", "9:00 AM BJT +1", "Sunday is for choosing the details before the week asks.", "A small ritual: one pendant, one ring, one pair of earrings. The uniform is ready. So are you.", "Story: this week's jewelry tray with tap-to-shop links.", `${baseHashtags} #SundayReset #CapsuleJewelry`],
  [8, "Neckline Guide", "Styling guide: crewneck, button-down, square neck, slip dress with best necklace length.", "12:00 PM ET", "12:00 AM BJT +1", "The necklace rule that makes every neckline cleaner.", "Match the line, do not fight it. A fine chain sharpens a crewneck, softens tailoring, and gives a slip dress just enough structure. Save this before your next outfit change.", "Before/after reel: same outfit without then with pendant and hoops.", "8:45 PM ET", "8:45 AM BJT +1", "The outfit was fine. The jewelry made it look styled.", "Minimal jewelry works because it changes proportion without adding noise. That is the quiet luxury move.", "Poll: Which neckline do you wear most?", `${baseHashtags} #NecklaceStyling #QuietLuxury`],
  [9, "Zodiac Gift", "Gift guide reel: choose zodiac pendant by recipient energy, not just birthday.", "7:15 PM ET", "7:15 AM BJT +1", "A zodiac gift that does not feel obvious.", "The right zodiac piece feels personal and polished. Gift it for a birthday, bridesmaid moment, new job, or the friend who deserves something chosen carefully.", "Packing reel: card, box, pendant, ribbon, hand-written note.", "9:20 PM ET", "9:20 AM BJT +1", "The note matters. The piece makes it last.", "Packaging is the first touchpoint. The jewelry is the memory that stays after the ribbon is gone.", "Question sticker: Who are you shopping for this month?", `${baseHashtags} #ZodiacJewelry #BirthdayGift`],
  [10, "Silver Or Gold", "Split-screen: same black knit styled with gold, then silver.", "1:15 PM ET", "1:15 AM BJT +1", "Gold softens. Silver sharpens.", "There is no universal best metal. There is only the mood you want the outfit to hold. Gold for warmth. Silver for precision. Both can be quiet.", "Comment-bait but refined: 'Tell me your sign and I will choose your metal.'", "8:30 PM ET", "8:30 AM BJT +1", "Drop your sign. We will choose the metal.", "Aries gets edge. Taurus gets warmth. Virgo gets clean lines. Scorpio gets shine with restraint. Tell us yours.", "Poll: Team gold or team silver?", `${baseHashtags} #GoldJewelry #SilverJewelry #ZodiacStyle`],
  [11, "Date Night", "Close shots: pendant at collarbone, ring on wine glass, earrings with slick bun.", "7:45 PM ET", "7:45 AM BJT +1", "Date night jewelry should look better up close.", "Choose pieces that reward proximity: a clean pendant, a ring with quiet shape, earrings that catch light when you turn your head.", "Outfit formula reel: black dress plus three jewelry levels: subtle, polished, magnetic.", "9:45 PM ET", "9:45 AM BJT +1", "The black dress formula, refined.", "Start minimal. Add one piece with presence. Stop before the jewelry starts speaking louder than you do.", "Story: date night edit with link sticker and slider.", `${baseHashtags} #DateNightStyle #FineJewelry`],
  [12, "Bridal Adjacent", "Wedding guest reel: cream silk dress, zodiac pendant, fine hoops, small ring stack.", "11:30 AM ET", "11:30 PM BJT", "Wedding guest jewelry that does not compete with the dress.", "For ceremonies, choose shine that moves quietly. Fine lines, soft polish, pieces that still feel like you after the photos are over.", "Bridesmaid gift POV: zodiac pendants laid by sign, cards beside each.", "8:15 PM ET", "8:15 AM BJT +1", "A bridesmaid gift with actual taste.", "Personal, wearable, and not destined for a drawer. Zodiac jewelry makes the gift feel chosen without becoming overly sentimental.", "Question sticker: Best wedding guest metal: gold or silver?", `${baseHashtags} #WeddingGuestStyle #BridesmaidGift`],
  [13, "Travel Edit", "Packing reel: one jewelry pouch, three pieces, five outfits.", "10:00 AM ET", "10:00 PM BJT", "The travel jewelry edit: three pieces, no chaos.", "Bring the pieces that solve outfits. A pendant, a hoop, a ring. Airport, dinner, museum, rooftop. Quiet luxury travels light.", "Hotel mirror reel: same pendant from morning shirt to evening dress.", "9:10 PM ET", "9:10 AM BJT +1", "Pack jewelry that changes the outfit, not the suitcase.", "A daily piece earns its place when it works across the entire trip. That is the test.", "Story: travel pouch flat lay and link sticker.", `${baseHashtags} #TravelStyle #CapsuleWardrobe`],
  [14, "Collector Mindset", "Founder-style reel: how to build a minimal jewelry wardrobe in order.", "12:45 PM ET", "12:45 AM BJT +1", "Buy the daily piece before the statement piece.", "Start with what touches your real life: hoops, chain, ring, zodiac pendant. The collection should feel edited before it feels full.", "Carousel-style reel: 'First five pieces for a grown jewelry wardrobe.'", "8:50 PM ET", "8:50 AM BJT +1", "Your first fine pieces should not feel random.", "Build by use case: everyday shine, neckline anchor, hand detail, evening lift, personal symbol. Save this before your next purchase.", "Quiz: Which piece are you missing: hoop, chain, ring, pendant?", `${baseHashtags} #JewelryWardrobe #FineJewelry`],
  [15, "Mid-Month Bestsellers", "Bestseller reel: top three pieces on body with saveable labels.", "7:00 PM ET", "7:00 AM BJT +1", "The pieces people keep coming back to.", "Our most-saved edit is quiet for a reason: clean scale, daily wearability, and enough polish to make basics feel intentional.", "DM proof reel: blurred buying questions with product clips answering them.", "9:25 PM ET", "9:25 AM BJT +1", "The questions we keep getting in DMs.", "How does it sit? Can I layer it? Is it giftable? Yes, yes, and beautifully. Here is the scale on a real neckline.", "Story: top 3 this week, tap to vote.", `${baseHashtags} #BestsellerJewelry #MinimalJewelry`],
  [16, "Texture Led", "ASMR reel: clasp, chain slide, ring on ceramic, box close.", "1:00 PM ET", "1:00 AM BJT +1", "Luxury you can hear a little.", "The sound of a clasp, the movement of a chain, the weight of a ring. Product proof does not need to be loud to be convincing.", "Slow-motion hand reel: sunlight over ring stack while reaching for glass.", "8:40 PM ET", "8:40 AM BJT +1", "The hand detail changes everything.", "Minimal rings are not background. They are the moment you notice while reaching, writing, holding, living.", "Slider: How satisfying is this clasp sound?", `${baseHashtags} #JewelryASMR #QuietLuxury`],
  [17, "Zodiac Series Fire", "Aries/Leo/Sagittarius styling reel: sharp tailoring, warm metal, confident close-ups.", "7:20 PM ET", "7:20 AM BJT +1", "Fire signs, but make it controlled.", "For Aries, Leo, and Sagittarius: shine with direction. A zodiac piece that feels confident without becoming costume.", "Text reel: three fire sign outfit moods with pendant transitions.", "9:00 PM ET", "9:00 AM BJT +1", "Your sign can be the detail, not the whole outfit.", "Wear the symbol like a private note. The styling stays clean; the meaning stays yours.", "Question sticker: Fire signs, gold or silver?", `${baseHashtags} #ZodiacJewelry #FireSigns`],
  [18, "Zodiac Series Earth", "Taurus/Virgo/Capricorn reel: grey knit, ivory shirt, dark denim, grounded styling.", "12:30 PM ET", "12:30 AM BJT +1", "Earth signs understand the value of a uniform.", "For Taurus, Virgo, and Capricorn: tactile, polished, repeatable. The kind of jewelry that quietly becomes part of your standards.", "Flat-lay reel: earth sign pendants on marble, cotton, brushed steel.", "8:35 PM ET", "8:35 AM BJT +1", "Precision is a love language.", "Clean lines. Good weight. No excess. Earth sign jewelry should feel as considered as the rest of your life.", "Poll: Earth signs, pendant or ring?", `${baseHashtags} #ZodiacStyle #EarthSigns`],
  [19, "Zodiac Series Air", "Gemini/Libra/Aquarius reel: movement, layered chains, silk shirt, city walking shot.", "7:10 PM ET", "7:10 AM BJT +1", "Air signs need jewelry with movement.", "For Gemini, Libra, and Aquarius: light-catching pieces that shift with you. Minimal, but never flat.", "Quick styling reel: one pendant, two chain lengths, three moods.", "9:40 PM ET", "9:40 AM BJT +1", "Layering does not have to look busy.", "Keep the lines fine and the spacing intentional. The result is movement, not clutter.", "Question sticker: Air signs, what are you wearing tomorrow?", `${baseHashtags} #ZodiacJewelry #AirSigns`],
  [20, "Zodiac Series Water", "Cancer/Scorpio/Pisces reel: black silk, soft shadows, pendant close to skin.", "11:15 AM ET", "11:15 PM BJT", "Water signs know a piece can hold a feeling.", "For Cancer, Scorpio, and Pisces: jewelry with intimacy. Clean enough for daily wear, meaningful enough to feel like a secret.", "Mood reel: pendant under cuff, ring under window light, slow breath pacing.", "8:55 PM ET", "8:55 AM BJT +1", "The most personal pieces are often the quietest.", "A symbol close to the skin. A ring you turn when thinking. A piece that becomes memory by repetition.", "Slider: How personal should jewelry feel?", `${baseHashtags} #WaterSigns #ModernHeirloom`],
  [21, "Customer Persona", "POV reel: 'You are 28 and your jewelry finally matches your taste.'", "6:45 PM ET", "6:45 AM BJT +1", "When your jewelry stops feeling accidental.", "There is a moment when your wardrobe gets quieter and your standards get clearer. That is where ASTRA STYLIX lives.", "Outfit reel: apartment elevator mirror, blazer, pendant, ring, low bun.", "9:15 PM ET", "9:15 AM BJT +1", "For women whose style does not need to announce itself.", "Restraint is not absence. It is knowing exactly which detail belongs.", "Story: 'Which ASTRA woman are you?' poll series.", `${baseHashtags} #MinimalStyle #EditorialStyle`],
  [22, "Objection Handling", "FAQ reel: 'Will it work with my everyday wardrobe?' show five outfits.", "12:20 PM ET", "12:20 AM BJT +1", "If it only works once, it is not your signature.", "Daily jewelry should move through your week: work, coffee, dinner, travel, errands. The more often it works, the more luxurious it becomes.", "FAQ reel: 'Is zodiac jewelry too trendy?' with refined styling proof.", "8:25 PM ET", "8:25 AM BJT +1", "Zodiac jewelry is only trendy when the design is loud.", "Keep the symbol refined and the styling disciplined. Meaning can be timeless when the piece is built with restraint.", "Question box: Ask us anything about scale, styling, gifting.", `${baseHashtags} #EverydayJewelry #ZodiacJewelry`],
  [23, "Gift Confidence", "Gift decision tree reel: sister, best friend, partner, bridesmaid, yourself.", "7:35 PM ET", "7:35 AM BJT +1", "The easiest luxury gift is personal, wearable, and not overdone.", "Choose by how she dresses: tailored, soft, minimal, romantic, sharp. Then add the zodiac detail if you want the gift to feel chosen.", "Packaging and note reel: gift card prompts for each recipient.", "9:05 PM ET", "9:05 AM BJT +1", "What to write in the card matters.", "Try: 'For the version of you I love watching you become.' Then let the piece do the rest.", "Story: gift recipient poll with link to edits.", `${baseHashtags} #LuxuryGift #BirthdayGift`],
  [24, "Stylist Energy", "Stylist POV reel: 'I would add this piece to make the outfit look expensive.'", "1:30 PM ET", "1:30 AM BJT +1", "The quiet upgrade stylists always notice.", "It is rarely more clothing. It is usually a cleaner line, a better proportion, and a piece of jewelry placed exactly right.", "Three-second transformations: neckline, wrist, hand, ear.", "8:50 PM ET", "8:50 AM BJT +1", "Small detail. Large styling effect.", "Minimal jewelry makes basics look considered because it creates focus. That is why the detail matters.", "Story: submit an outfit; we choose the jewelry.", `${baseHashtags} #StylingTips #QuietLuxury`],
  [25, "Original Content", "Founder hands arranging pieces for shoot day: no face, studio intimacy.", "11:45 AM ET", "11:45 PM BJT", "Behind every quiet piece is a very precise decision.", "The crop, the chain length, the way it sits on skin. Minimal does not mean simple; it means everything unnecessary has been edited out.", "Shoot-day reel: macro, mid-shot, body scale, final grid preview.", "9:10 PM ET", "9:10 AM BJT +1", "The product has to look good in motion.", "Flat-lays are beautiful. Real wear is the proof. We shoot both because trust needs context.", "Behind-the-scenes Story: choose tomorrow's cover frame.", `${baseHashtags} #BehindTheBrand #JewelryStudio`],
  [26, "Personal Signature", "Reel: repeated daily moments wearing same pendant: keys, laptop, coffee, dinner.", "7:05 PM ET", "7:05 AM BJT +1", "A signature is built by repetition.", "The same piece, worn often, becomes part of how people remember you. That is the quiet power of everyday fine jewelry.", "Text overlay reel: 'Not loud. Not anonymous. Never accidental.'", "9:35 PM ET", "9:35 AM BJT +1", "Not loud. Not anonymous. Never accidental.", "Jewelry that lives between restraint and magnetism: clean enough for every day, personal enough to become yours.", "Story: Which piece would become your signature?", `${baseHashtags} #SignatureStyle #FineJewelry`],
  [27, "Seasonal Dressing", "Summer evening reel: bare shoulders, pendant, small hoops, clean skin, linen.", "10:45 AM ET", "10:45 PM BJT", "Summer jewelry should feel like skin, light, and one clean line.", "Bare necklines make scale matter. Choose pieces that sit softly and catch light without overwhelming the outfit.", "Office AC to rooftop reel: grey knit over shoulders, pendant visible, hoops.", "8:20 PM ET", "8:20 AM BJT +1", "The summer-to-evening detail.", "A fine chain and small hoop make warm-weather basics feel polished from commute to rooftop.", "Story: summer jewelry edit with product links.", `${baseHashtags} #SummerStyle #MinimalJewelry`],
  [28, "Community Engagement", "Comment reply reel: answer 'Can I wear zodiac jewelry every day?'", "12:10 PM ET", "12:10 AM BJT +1", "Yes, if it looks this restrained.", "Daily zodiac jewelry works when the design feels more like a personal mark than a trend. Keep the styling clean and let the meaning stay close.", "Comment reply reel: answer 'How do I layer without looking overdone?'", "9:00 PM ET", "9:00 AM BJT +1", "The layering rule: leave space.", "Two fine lines with visible distance will look more expensive than three chains fighting for attention. Save this rule.", "Question box: What should we answer next?", `${baseHashtags} #JewelryTips #ZodiacJewelry`],
  [29, "Launch Push", "Soft launch reel: hero edit of top pieces, body scale, packaging, website click CTA.", "7:00 PM ET", "7:00 AM BJT +1", "The quiet edit is live.", "Pieces for the woman whose style does not need to introduce itself loudly. Minimal, personal, polished. Shop the ASTRA edit.", "Founder note reel: why ASTRA STYLIX exists, with product B-roll.", "9:30 PM ET", "9:30 AM BJT +1", "For the private luxury of getting dressed for yourself.", "ASTRA STYLIX was built for modern heirlooms without stiffness: jewelry that finishes the outfit and slowly becomes part of you.", "Story: launch countdown, link sticker, top 3 products.", `${baseHashtags} #LuxuryJewelry #QuietlyStyled`],
  [30, "Monthly Recap", "Recap reel: 30 days of quiet details, fastest cuts, best comments, top products.", "11:30 AM ET", "11:30 PM BJT", "Thirty days of proof that restraint can still be magnetic.", "The pieces you saved most, asked about most, and styled with us all month. This is the edit worth carrying forward.", "Next-month teaser: zodiac series, gift edits, office-to-evening styling.", "8:45 PM ET", "8:45 AM BJT +1", "Next month: more signs, sharper styling, quieter luxury.", "Tell us what you want next: zodiac deep dives, styling rules, gift guides, or founder notes. We are building the edit with you.", "Story: recap poll plus 'choose next series' sticker.", `${baseHashtags} #QuietLuxury #ASTRAEdit`],
];

const sheet = addSheet("30-Day Calendar");
title(sheet, "A1:O1", "ASTRA STYLIX 30-Day Content Calendar", "Target: US women 22-35. Focus: quiet luxury, minimalist jewelry, zodiac jewelry, and fine jewelry.");

setValues(sheet, "A4:O4", [[
  "Day",
  "Content Pillar",
  "Reel 1",
  "Reel 1 Time ET",
  "Reel 1 Time Beijing",
  "Reel 1 Hook",
  "Reel 1 Caption",
  "Reel 2",
  "Reel 2 Time ET",
  "Reel 2 Time Beijing",
  "Reel 2 Hook",
  "Reel 2 Caption",
  "Story",
  "Hashtags",
  "CTA / KPI Focus",
]]);

const rows = calendar.map((row) => {
  const [day, pillar, r1, t1, b1, h1, c1, r2, t2, b2, h2, c2, story, hashtags] = row;
  const cta = day % 5 === 0 ? "Website clicks / product link taps" : day % 3 === 0 ? "Saves / shares" : "Comments / DMs";
  return [day, pillar, r1, t1, b1, h1, c1, r2, t2, b2, h2, c2, story, hashtags, cta];
});
setValues(sheet, "A5:O34", rows);

header(sheet, "A4:O4");
table(sheet, "A5:O34");
widths(sheet, {
  A: 55,
  B: 135,
  C: 310,
  D: 95,
  E: 120,
  F: 230,
  G: 390,
  H: 310,
  I: 95,
  J: 120,
  K: 230,
  L: 390,
  M: 300,
  N: 310,
  O: 140,
});
sheet.freezePanes.freezeRows(4);
r(sheet, "A5:A34").format.horizontalAlignment = "Center";

const guide = addSheet("Brand Rules");
title(guide, "A1:H1", "ASTRA STYLIX Brand Rules Applied", "Condensed from the Brand Bible for content execution.");
setValues(guide, "A4:H4", [["Area", "Rule", "How This Calendar Uses It", "Avoid", "Target Audience", "Primary KPI", "Posting Logic", "Notes"]]);
setValues(guide, "A5:H14", [
  ["Positioning", "Premium daily jewelry, modern heirlooms without stiffness", "Daily uniform, self-purchase, gifting, and office-to-evening narratives", "Overly stiff luxury language", "US women 22-35", "Saves, profile visits", "ET prime windows", ""],
  ["Voice", "Restrained, tactile, self-possessed", "Captions use precise sensory language and soft CTAs", "Hard selling, hype, trend-chasing", "Polished Independent", "Comments, DMs", "Evening discovery", ""],
  ["Visuals", "Negative space, macro, body scale, clean wardrobe", "Every Reel concept includes macro, body, mirror, or styling proof", "Cluttered vanity setups", "Editorial Minimalist", "Saves", "Lunch + evening", ""],
  ["Zodiac", "Personal, refined, not novelty astrology", "Zodiac series by element and giftable personal-symbol hooks", "Costume-like symbols", "New Collector", "Shares, DMs", "Evening comments", ""],
  ["Fine Jewelry", "Proof through texture, movement, clasp, weight, polish", "ASMR, macro, and FAQ proof content throughout", "Flat-lay only", "Modern Gift Buyer", "Website clicks", "High-intent evening", ""],
  ["Caption Formula", "Hook, context, proof, soft CTA", "Each caption follows emotional truth plus product/styling proof", "Long generic product copy", "All personas", "Saves/clicks", "All posts", ""],
  ["Hashtags", "5-9 tags: branded, category, style, occasion/location", "Each day uses branded/category/style plus occasion-specific tags", "Hashtag stuffing", "US/Canada style audience", "Reach", "All posts", ""],
  ["Stories", "Daily polls, links, behind the scenes, UGC energy", "Every day includes an interactive Story idea", "Passive reposts only", "Warm audience", "Replies/clicks", "Between Reels", ""],
  ["Creative Testing", "Refresh hooks weekly; keep visual world consistent", "Pillars rotate while staying inside quiet luxury world", "Changing identity daily", "US women 22-35", "Save rate", "Weekly review", ""],
  ["Commerce", "Instagram as editorial storefront", "CTA/KPI focus column separates saves, DMs, and clicks", "Only awareness content", "Buyers and gifters", "Orders", "High-intent posts", ""],
]);
header(guide, "A4:H4");
table(guide, "A5:H14");
widths(guide, { A: 130, B: 260, C: 320, D: 220, E: 160, F: 140, G: 160, H: 180 });
guide.freezePanes.freezeRows(4);

const schedule = addSheet("Posting Cadence");
title(schedule, "A1:H1", "Recommended Posting Cadence", "US-targeted scheduling with Beijing operating equivalents.");
setValues(schedule, "A4:H4", [["Asset", "Primary US Window", "Beijing Equivalent", "Why", "Fallback US Window", "Fallback Beijing", "Best Days", "Notes"]]);
setValues(schedule, "A5:H8", [
  ["Reel 1", "10:00 AM-1:30 PM ET", "10:00 PM-1:30 AM BJT", "Lunch scroll and early engagement window", "7:00 PM-7:45 PM ET", "7:00 AM-7:45 AM BJT +1", "Tue, Wed, Thu, Sun", "Use for educational, gift, FAQ, and proof content."],
  ["Story", "Between Reels", "Between Reels", "Keeps audience warm and drives link taps", "8:00 PM-9:00 PM ET", "8:00 AM-9:00 AM BJT +1", "Daily", "Use poll/question/link stickers."],
  ["Reel 2", "8:15 PM-9:45 PM ET", "8:15 AM-9:45 AM BJT +1", "Evening discovery and higher comment intent", "6:45 PM-7:30 PM ET", "6:45 AM-7:30 AM BJT +1", "Daily", "Use for emotional, styling, zodiac, and conversion angles."],
  ["Engagement", "First 30 minutes after posting", "Immediate", "Reply velocity supports trust and early distribution", "Next morning ET", "Evening BJT", "Daily", "Pin best comment and answer buying questions fast."],
]);
header(schedule, "A4:H4");
table(schedule, "A5:H8");
widths(schedule, { A: 110, B: 165, C: 180, D: 260, E: 165, F: 180, G: 135, H: 280 });
schedule.freezePanes.freezeRows(4);

for (const ws of [sheet, guide, schedule]) {
  ws.getUsedRange().format.font.name = "Aptos";
  ws.getUsedRange().format.font.size = 10;
}

await fs.mkdir(outputDir, { recursive: true });

const errorScan = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(errorScan.ndjson);

for (const sheetName of ["30-Day Calendar", "Brand Rules", "Posting Cadence"]) {
  await workbook.render({ sheetName, range: "A1:O18", scale: 1 });
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);
