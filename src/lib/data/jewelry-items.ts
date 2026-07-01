export interface JewelryItem {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  image: string;
  link: string;
  identityId: string;
}

export const JEWELRY_ITEMS: JewelryItem[] = [
  {
    id: "aurora-set",
    name: "Aurora Opal Collection",
    nameCn: "\u6781\u5149\u6b27\u6cca\u5957\u88c5",
    description: "Opal necklace & moonstone earrings",
    image: "/identity-portrait/jewelry/01-aurora/cover.png",
    link: "/collection?identity=aurora",
    identityId: "aurora",
  },
  {
    id: "muse-set",
    name: "Muse Sculptural Collection",
    nameCn: "\u7f2a\u65af\u96d5\u5851\u5957\u88c5",
    description: "Deconstructed titanium pendant & geometric earrings",
    image: "/identity-portrait/jewelry/02-muse/cover.png",
    link: "/collection?identity=muse",
    identityId: "muse",
  },
  {
    id: "ember-set",
    name: "Ember Ruby Gold Collection",
    nameCn: "\u4f59\u70ec\u7ea2\u5b9d\u53e4\u91d1\u5957\u88c5",
    description: "Ruby pendant & carnelian gold rings",
    image: "/identity-portrait/jewelry/03-ember/cover.png",
    link: "/collection?identity=ember",
    identityId: "ember",
  },
  {
    id: "monarch-set",
    name: "Monarch Sapphire Crown Collection",
    nameCn: "\u738b\u51a0\u84dd\u5b9d\u7687\u5ba4\u5957\u88c5",
    description: "Crown pendant, tiara ring & sapphire earrings",
    image: "/identity-portrait/jewelry/04-monarch/cover.png",
    link: "/collection?identity=monarch",
    identityId: "monarch",
  },
  {
    id: "atlas-set",
    name: "Atlas Earth Stone Collection",
    nameCn: "\u5927\u5730\u539f\u77f3\u5957\u88c5",
    description: "Raw agate pendant & wood-stone earrings",
    image: "/identity-portrait/jewelry/05-atlas/cover.png",
    link: "/collection?identity=atlas",
    identityId: "atlas",
  },
  {
    id: "nova-set",
    name: "Nova Cyber Geometric Collection",
    nameCn: "\u661f\u7130\u8d5b\u535a\u51e0\u4f55\u5957\u88c5",
    description: "Star burst pendant & lightning bolt earrings",
    image: "/identity-portrait/jewelry/06-nova/cover.png",
    link: "/collection?identity=nova",
    identityId: "nova",
  },
  {
    id: "bloom-set",
    name: "Bloom Floral Pearl Collection",
    nameCn: "\u82b1\u5883\u73cd\u73e0\u82b1\u5349\u5957\u88c5",
    description: "Daisy pearl necklace & cherry blossom earrings",
    image: "/identity-portrait/jewelry/07-bloom/cover.png",
    link: "/collection?identity=bloom",
    identityId: "bloom",
  },
  {
    id: "prism-set",
    name: "Prism Vintage Gem Collection",
    nameCn: "\u68f1\u955c\u590d\u53e4\u5f69\u5b9d\u5957\u88c5",
    description: "Multi-gem pendant & vintage drop earrings",
    image: "/identity-portrait/jewelry/08-prism/cover.png",
    link: "/collection?identity=prism",
    identityId: "prism",
  },
  {
    id: "moonlight-set",
    name: "Moonlight Silver Pearl Collection",
    nameCn: "\u6708\u5149\u94f6\u73e0\u5957\u88c5",
    description: "Moonstone crescent pendant & pearl earrings",
    image: "/identity-portrait/jewelry/09-moonlight/cover.png",
    link: "/collection?identity=moonlight",
    identityId: "moonlight",
  },
  {
    id: "velvet-set",
    name: "Velvet Dark Onyx Collection",
    nameCn: "\u7ed2\u591c\u6697\u8c03\u9ed1\u7389\u5957\u88c5",
    description: "Black onyx pendant & matte drop earrings",
    image: "/identity-portrait/jewelry/10-velvet/cover.png",
    link: "/collection?identity=velvet",
    identityId: "velvet",
  },
  {
    id: "ink-set",
    name: "Ink Jade Pearl Collection",
    nameCn: "\u6e05\u7814\u7389\u77f3\u73cd\u73e0\u5957\u88c5",
    description: "Jade drop pendant & white pearl earrings",
    image: "/identity-portrait/jewelry/11-ink/cover.png",
    link: "/collection?identity=ink",
    identityId: "ink",
  },
  {
    id: "oracle-set",
    name: "Oracle Diamond Pearl Collection",
    nameCn: "\u661f\u955c\u94bb\u77f3\u73cd\u73e0\u5957\u88c5",
    description: "Sun pearl pendant & diamond halo earrings",
    image: "/identity-portrait/jewelry/12-oracle/cover.png",
    link: "/collection?identity=oracle",
    identityId: "oracle",
  },
  {
    id: "purity-set",
    name: "Purity Raw Stone Collection",
    nameCn: "\u5f52\u7483\u539f\u77f3\u5957\u88c5",
    description: "Obsidian orb pendant & raw stone earrings",
    image: "/identity-portrait/jewelry/13-purity/cover.png",
    link: "/collection?identity=purity",
    identityId: "purity",
  },
  {
    id: "axis-set",
    name: "Axis Geometric Diamond Collection",
    nameCn: "\u8861\u5f8b\u51e0\u4f55\u94bb\u77f3\u5957\u88c5",
    description: "Cross pendant & princess cut studs",
    image: "/identity-portrait/jewelry/14-axis/cover.png",
    link: "/collection?identity=axis",
    identityId: "axis",
  },
  {
    id: "void-set",
    name: "Void Minimal Pearl Collection",
    nameCn: "\u7a7a\u5883\u6781\u7b80\u73cd\u73e0\u5957\u88c5",
    description: "Single jade drop & pearl earrings",
    image: "/identity-portrait/jewelry/15-void/cover.png",
    link: "/collection?identity=void",
    identityId: "void",
  },
  {
    id: "tide-set",
    name: "Tide Ocean Pearl Collection",
    nameCn: "\u6f6e\u6c50\u6d77\u6d0b\u73cd\u73e0\u5957\u88c5",
    description: "Wave necklace & shell pearl earrings",
    image: "/identity-portrait/jewelry/16-tide/cover.png",
    link: "/collection?identity=tide",
    identityId: "tide",
  },
];

export function getJewelryForIdentity(identityId: string): JewelryItem[] {
  return JEWELRY_ITEMS.filter((item) => item.identityId === identityId);
}

export function getJewelryById(id: string): JewelryItem | undefined {
  return JEWELRY_ITEMS.find((item) => item.id === id);
}
