import { useState, useEffect } from "react";

// ─── STATUS CONFIG ───
const statusConfig = {
  injured: { label: "Sakat", labelEN: "Injured", color: "#FF3B30", bg: "rgba(255,59,48,0.12)", icon: "🏥", pulse: "pulseRed" },
  suspended: { label: "Cezalı", labelEN: "Suspended", color: "#AF52DE", bg: "rgba(175,82,222,0.12)", icon: "🟥", pulse: "pulsePurple" },
  at_risk: { label: "Kart Riski", labelEN: "Card Risk", color: "#FF9500", bg: "rgba(255,149,0,0.12)", icon: "🟨", pulse: "pulseYellow" },
  doubtful: { label: "Şüpheli", labelEN: "Doubtful", color: "#FFCC00", bg: "rgba(255,204,0,0.12)", icon: "⚠️", pulse: "pulseAmber" },
  fit: { label: "Hazır", labelEN: "Fit", color: "#30D158", bg: "rgba(48,209,88,0.12)", icon: "✅", pulse: "" },
};

function getDaysUntil(d) {
  if (!d) return null;
  const diff = Math.ceil((new Date(d) - new Date()) / 864e5);
  return diff > 0 ? diff : 0;
}

// ─── LEAGUE DATA ───
const LEAGUES = {
  laliga: {
    name: "La Liga", country: "İspanya", icon: "🇪🇸", sport: "football",
    color: "#FF4B44", gradient: "linear-gradient(135deg, #FF4B44, #D62828)",
    teams: [
      { name: "Real Madrid", badge: "⚪", stars: [
        { name: "Vinícius Jr.", pos: "LW", num: 7, flag: "🇧🇷", status: "fit", injury: null, returnDate: null, cards: { yellow: 3, red: 0 }, cardLimit: 5 },
        { name: "Jude Bellingham", pos: "CM", num: 5, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", status: "injured", injury: "Hamstring strain", returnDate: "2026-03-20", cards: { yellow: 2, red: 0 }, cardLimit: 5 },
        { name: "Kylian Mbappé", pos: "ST", num: 9, flag: "🇫🇷", status: "at_risk", injury: null, returnDate: null, cards: { yellow: 4, red: 0 }, cardLimit: 5 },
      ]},
      { name: "FC Barcelona", badge: "🔵", stars: [
        { name: "Lamine Yamal", pos: "RW", num: 19, flag: "🇪🇸", status: "injured", injury: "Ankle sprain", returnDate: "2026-03-15", cards: { yellow: 1, red: 0 }, cardLimit: 5 },
        { name: "Raphinha", pos: "LW", num: 11, flag: "🇧🇷", status: "fit", injury: null, returnDate: null, cards: { yellow: 2, red: 0 }, cardLimit: 5 },
        { name: "Robert Lewandowski", pos: "ST", num: 9, flag: "🇵🇱", status: "suspended", injury: null, returnDate: "2026-03-08", cards: { yellow: 5, red: 0 }, cardLimit: 5 },
      ]},
      { name: "Atlético Madrid", badge: "🔴", stars: [
        { name: "Antoine Griezmann", pos: "ST", num: 7, flag: "🇫🇷", status: "fit", injury: null, returnDate: null, cards: { yellow: 1, red: 0 }, cardLimit: 5 },
        { name: "Julián Álvarez", pos: "ST", num: 19, flag: "🇦🇷", status: "at_risk", injury: null, returnDate: null, cards: { yellow: 4, red: 0 }, cardLimit: 5 },
        { name: "Alexander Sörloth", pos: "ST", num: 9, flag: "🇳🇴", status: "doubtful", injury: "Knee discomfort", returnDate: "2026-03-05", cards: { yellow: 2, red: 0 }, cardLimit: 5 },
      ]},
      { name: "Athletic Bilbao", badge: "🦁", stars: [
        { name: "Nico Williams", pos: "LW", num: 11, flag: "🇪🇸", status: "fit", injury: null, returnDate: null, cards: { yellow: 3, red: 0 }, cardLimit: 5 },
        { name: "Iñaki Williams", pos: "RW", num: 9, flag: "🇬🇭", status: "suspended", injury: null, returnDate: "2026-03-09", cards: { yellow: 0, red: 1 }, cardLimit: 5 },
        { name: "Oihan Sancet", pos: "AM", num: 8, flag: "🇪🇸", status: "injured", injury: "ACL injury", returnDate: "2026-04-01", cards: { yellow: 0, red: 0 }, cardLimit: 5 },
      ]},
      { name: "Real Sociedad", badge: "🔵", stars: [
        { name: "Mikel Oyarzabal", pos: "LW", num: 10, flag: "🇪🇸", status: "fit", injury: null, returnDate: null, cards: { yellow: 2, red: 0 }, cardLimit: 5 },
        { name: "Take Kubo", pos: "RW", num: 14, flag: "🇯🇵", status: "at_risk", injury: null, returnDate: null, cards: { yellow: 4, red: 0 }, cardLimit: 5 },
        { name: "Martin Zubimendi", pos: "DM", num: 4, flag: "🇪🇸", status: "fit", injury: null, returnDate: null, cards: { yellow: 1, red: 0 }, cardLimit: 5 },
      ]},
      { name: "Villarreal", badge: "🟡", stars: [
        { name: "Gerard Moreno", pos: "ST", num: 7, flag: "🇪🇸", status: "fit", injury: null, returnDate: null, cards: { yellow: 0, red: 0 }, cardLimit: 5 },
        { name: "Álex Baena", pos: "CM", num: 16, flag: "🇪🇸", status: "suspended", injury: null, returnDate: "2026-03-10", cards: { yellow: 5, red: 0 }, cardLimit: 5 },
        { name: "Yeremy Pino", pos: "RW", num: 21, flag: "🇪🇸", status: "injured", injury: "Knee ligament", returnDate: "2026-03-25", cards: { yellow: 1, red: 0 }, cardLimit: 5 },
      ]},
    ],
  },
  seriea: {
    name: "Serie A", country: "İtalya", icon: "🇮🇹", sport: "football",
    color: "#008C45", gradient: "linear-gradient(135deg, #008C45, #006233)",
    teams: [
      { name: "Inter Milan", badge: "⚫", stars: [
        { name: "Lautaro Martínez", pos: "ST", num: 10, flag: "🇦🇷", status: "fit", injury: null, returnDate: null, cards: { yellow: 3, red: 0 }, cardLimit: 5 },
        { name: "Marcus Thuram", pos: "ST", num: 9, flag: "🇫🇷", status: "suspended", injury: null, returnDate: "2026-03-08", cards: { yellow: 5, red: 0 }, cardLimit: 5 },
        { name: "Nicolò Barella", pos: "CM", num: 23, flag: "🇮🇹", status: "at_risk", injury: null, returnDate: null, cards: { yellow: 4, red: 0 }, cardLimit: 5 },
      ]},
      { name: "SSC Napoli", badge: "🔵", stars: [
        { name: "Khvicha Kvaratskhelia", pos: "LW", num: 77, flag: "🇬🇪", status: "fit", injury: null, returnDate: null, cards: { yellow: 1, red: 0 }, cardLimit: 5 },
        { name: "Victor Osimhen", pos: "ST", num: 9, flag: "🇳🇬", status: "injured", injury: "Muscle tear", returnDate: "2026-03-18", cards: { yellow: 2, red: 0 }, cardLimit: 5 },
        { name: "Stanislav Lobotka", pos: "DM", num: 68, flag: "🇸🇰", status: "at_risk", injury: null, returnDate: null, cards: { yellow: 4, red: 0 }, cardLimit: 5 },
      ]},
      { name: "Juventus", badge: "⚪", stars: [
        { name: "Dušan Vlahović", pos: "ST", num: 9, flag: "🇷🇸", status: "injured", injury: "Groin injury", returnDate: "2026-03-22", cards: { yellow: 3, red: 0 }, cardLimit: 5 },
        { name: "Kenan Yıldız", pos: "LW", num: 10, flag: "🇹🇷", status: "fit", injury: null, returnDate: null, cards: { yellow: 2, red: 0 }, cardLimit: 5 },
        { name: "Teun Koopmeiners", pos: "CM", num: 8, flag: "🇳🇱", status: "suspended", injury: null, returnDate: "2026-03-09", cards: { yellow: 0, red: 1 }, cardLimit: 5 },
      ]},
      { name: "AC Milan", badge: "🔴", stars: [
        { name: "Rafael Leão", pos: "LW", num: 10, flag: "🇵🇹", status: "fit", injury: null, returnDate: null, cards: { yellow: 2, red: 0 }, cardLimit: 5 },
        { name: "Christian Pulisic", pos: "RW", num: 11, flag: "🇺🇸", status: "doubtful", injury: "Ankle knock", returnDate: "2026-03-04", cards: { yellow: 1, red: 0 }, cardLimit: 5 },
        { name: "Theo Hernández", pos: "LB", num: 19, flag: "🇫🇷", status: "at_risk", injury: null, returnDate: null, cards: { yellow: 4, red: 0 }, cardLimit: 5 },
      ]},
      { name: "Atalanta", badge: "⚫", stars: [
        { name: "Ademola Lookman", pos: "ST", num: 11, flag: "🇳🇬", status: "fit", injury: null, returnDate: null, cards: { yellow: 0, red: 0 }, cardLimit: 5 },
        { name: "Charles De Ketelaere", pos: "AM", num: 17, flag: "🇧🇪", status: "fit", injury: null, returnDate: null, cards: { yellow: 3, red: 0 }, cardLimit: 5 },
        { name: "Gianluca Scamacca", pos: "ST", num: 9, flag: "🇮🇹", status: "injured", injury: "ACL reconstruction", returnDate: "2026-05-01", cards: { yellow: 0, red: 0 }, cardLimit: 5 },
      ]},
      { name: "AS Roma", badge: "🟡", stars: [
        { name: "Paulo Dybala", pos: "AM", num: 21, flag: "🇦🇷", status: "doubtful", injury: "Thigh tightness", returnDate: "2026-03-07", cards: { yellow: 3, red: 0 }, cardLimit: 5 },
        { name: "Lorenzo Pellegrini", pos: "CM", num: 7, flag: "🇮🇹", status: "suspended", injury: null, returnDate: "2026-03-09", cards: { yellow: 5, red: 0 }, cardLimit: 5 },
        { name: "Artem Dovbyk", pos: "ST", num: 11, flag: "🇺🇦", status: "fit", injury: null, returnDate: null, cards: { yellow: 2, red: 0 }, cardLimit: 5 },
      ]},
    ],
  },
  bundesliga: {
    name: "Bundesliga", country: "Almanya", icon: "🇩🇪", sport: "football",
    color: "#D20515", gradient: "linear-gradient(135deg, #D20515, #9B0410)",
    teams: [
      { name: "Bayern Munich", badge: "🔴", stars: [
        { name: "Harry Kane", pos: "ST", num: 9, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", status: "fit", injury: null, returnDate: null, cards: { yellow: 2, red: 0 }, cardLimit: 5 },
        { name: "Jamal Musiala", pos: "AM", num: 42, flag: "🇩🇪", status: "at_risk", injury: null, returnDate: null, cards: { yellow: 4, red: 0 }, cardLimit: 5 },
        { name: "Leroy Sané", pos: "RW", num: 10, flag: "🇩🇪", status: "injured", injury: "Knee surgery recovery", returnDate: "2026-03-28", cards: { yellow: 1, red: 0 }, cardLimit: 5 },
      ]},
      { name: "Bayer Leverkusen", badge: "⚫", stars: [
        { name: "Florian Wirtz", pos: "AM", num: 10, flag: "🇩🇪", status: "fit", injury: null, returnDate: null, cards: { yellow: 1, red: 0 }, cardLimit: 5 },
        { name: "Granit Xhaka", pos: "CM", num: 34, flag: "🇨🇭", status: "suspended", injury: null, returnDate: "2026-03-08", cards: { yellow: 5, red: 0 }, cardLimit: 5 },
        { name: "Victor Boniface", pos: "ST", num: 14, flag: "🇳🇬", status: "injured", injury: "Muscle injury", returnDate: "2026-03-12", cards: { yellow: 2, red: 0 }, cardLimit: 5 },
      ]},
      { name: "Borussia Dortmund", badge: "🟡", stars: [
        { name: "Donyell Malen", pos: "RW", num: 21, flag: "🇳🇱", status: "fit", injury: null, returnDate: null, cards: { yellow: 3, red: 0 }, cardLimit: 5 },
        { name: "Julian Brandt", pos: "AM", num: 10, flag: "🇩🇪", status: "at_risk", injury: null, returnDate: null, cards: { yellow: 4, red: 0 }, cardLimit: 5 },
        { name: "Karim Adeyemi", pos: "LW", num: 27, flag: "🇩🇪", status: "injured", injury: "Foot bruise", returnDate: "2026-03-10", cards: { yellow: 0, red: 0 }, cardLimit: 5 },
      ]},
      { name: "RB Leipzig", badge: "🔴", stars: [
        { name: "Loïs Openda", pos: "ST", num: 17, flag: "🇧🇪", status: "fit", injury: null, returnDate: null, cards: { yellow: 2, red: 0 }, cardLimit: 5 },
        { name: "Xavi Simons", pos: "AM", num: 10, flag: "🇳🇱", status: "injured", injury: "Ankle ligament", returnDate: "2026-03-30", cards: { yellow: 1, red: 0 }, cardLimit: 5 },
        { name: "Dani Olmo", pos: "AM", num: 7, flag: "🇪🇸", status: "suspended", injury: null, returnDate: "2026-03-09", cards: { yellow: 0, red: 1 }, cardLimit: 5 },
      ]},
      { name: "VfB Stuttgart", badge: "🔴", stars: [
        { name: "Serhou Guirassy", pos: "ST", num: 9, flag: "🇬🇳", status: "fit", injury: null, returnDate: null, cards: { yellow: 1, red: 0 }, cardLimit: 5 },
        { name: "Chris Führich", pos: "LW", num: 22, flag: "🇩🇪", status: "doubtful", injury: "Calf issue", returnDate: "2026-03-06", cards: { yellow: 3, red: 0 }, cardLimit: 5 },
        { name: "Enzo Millot", pos: "AM", num: 10, flag: "🇫🇷", status: "fit", injury: null, returnDate: null, cards: { yellow: 2, red: 0 }, cardLimit: 5 },
      ]},
    ],
  },
  euroleague: {
    name: "EuroLeague", country: "Avrupa", icon: "🏀", sport: "basketball",
    color: "#F26522", gradient: "linear-gradient(135deg, #F26522, #C44F15)",
    teams: [
      { name: "Real Madrid Baloncesto", badge: "⚪", stars: [
        { name: "Facundo Campazzo", pos: "PG", num: 11, flag: "🇦🇷", status: "fit", injury: null, returnDate: null },
        { name: "Mario Hezonja", pos: "SF", num: 8, flag: "🇭🇷", status: "injured", injury: "Calf strain", returnDate: "2026-03-20" },
        { name: "Walter Tavares", pos: "C", num: 22, flag: "🇨🇻", status: "fit", injury: null, returnDate: null },
      ]},
      { name: "FC Barcelona Basket", badge: "🔵", stars: [
        { name: "Kevin Punter", pos: "SG", num: 0, flag: "🇺🇸", status: "fit", injury: null, returnDate: null },
        { name: "Willy Hernangómez", pos: "C", num: 14, flag: "🇪🇸", status: "doubtful", injury: "Back spasms", returnDate: "2026-03-08" },
        { name: "Nicolas Laprovittola", pos: "PG", num: 20, flag: "🇦🇷", status: "fit", injury: null, returnDate: null },
      ]},
      { name: "Olympiacos", badge: "🔴", stars: [
        { name: "Sasha Vezenkov", pos: "SF", num: 8, flag: "🇧🇬", status: "fit", injury: null, returnDate: null },
        { name: "Evan Fournier", pos: "SG", num: 10, flag: "🇫🇷", status: "injured", injury: "Knee soreness", returnDate: "2026-03-12" },
        { name: "Thomas Walkup", pos: "PG", num: 0, flag: "🇺🇸", status: "injured", injury: "Hamstring", returnDate: "2026-03-15" },
      ]},
      { name: "Panathinaikos", badge: "🟢", stars: [
        { name: "Kendrick Nunn", pos: "PG", num: 12, flag: "🇺🇸", status: "fit", injury: null, returnDate: null },
        { name: "Mathias Lessort", pos: "C", num: 26, flag: "🇫🇷", status: "injured", injury: "Knee surgery", returnDate: "2026-04-01" },
        { name: "Jerian Grant", pos: "PG", num: 2, flag: "🇺🇸", status: "fit", injury: null, returnDate: null },
      ]},
      { name: "Fenerbahçe Beko", badge: "🟡", stars: [
        { name: "Nigel Hayes-Davis", pos: "PF", num: 2, flag: "🇺🇸", status: "fit", injury: null, returnDate: null },
        { name: "Nick Calathes", pos: "PG", num: 33, flag: "🇬🇷", status: "injured", injury: "Achilles tendinitis", returnDate: "2026-03-18" },
        { name: "Bonzie Colson", pos: "PF", num: 35, flag: "🇺🇸", status: "doubtful", injury: "Ankle twist", returnDate: "2026-03-05" },
      ]},
      { name: "Anadolu Efes", badge: "🔵", stars: [
        { name: "Shane Larkin", pos: "PG", num: 0, flag: "🇺🇸", status: "fit", injury: null, returnDate: null },
        { name: "Elijah Bryant", pos: "SG", num: 4, flag: "🇺🇸", status: "injured", injury: "Shoulder dislocation", returnDate: "2026-03-22" },
        { name: "Vincent Poirier", pos: "C", num: 17, flag: "🇫🇷", status: "injured", injury: "Knee surgery", returnDate: "2026-06-01" },
      ]},
    ],
  },
};

// ─── CREATIVE SUGGESTION ENGINE ───
function getCreative(player, team, league) {
  const isBasketball = league.sport === "basketball";
  const s = player.status;

  if (s === "injured") {
    const d = getDaysUntil(player.returnDate);
    return {
      priority: "critical",
      title: `🏥 "${player.name} Geri Sayım"`,
      desc: `${d != null ? d + " gün sonra dönüş bekleniyor" : "Dönüş tarihi belirsiz"}. Comeback temalı içerik fırsatı.`,
      formats: [
        { icon: "📱", label: "Countdown Story", detail: "Her gün güncellenen geri sayım" },
        { icon: "🎬", label: "Comeback Reels", detail: "Antrenman görüntüleri + motivasyon" },
        { icon: "📊", label: "Miss Tracker", detail: `Kaçırdığı maç sayısı infografik` },
        { icon: "🔔", label: "Push Notification", detail: "Dönüş günü breaking news" },
      ],
      tags: ["Story", "Post", "Reels", "Push"],
    };
  }

  if (s === "suspended") {
    return {
      priority: "high",
      title: `🟥 "${player.name} Cezalı — Kadro Dışı"`,
      desc: player.cards?.red > 0
        ? `Kırmızı kart cezası. ${getDaysUntil(player.returnDate) || "?"} gün sonra dönüş.`
        : `Sarı kart birikimi nedeniyle cezalı (${player.cards?.yellow}/${player.cardLimit}).`,
      formats: [
        { icon: "📋", label: "Alternatif XI", detail: "Cezalı oyuncu yerine kim oynayacak?" },
        { icon: "📊", label: "Ceza İnfografik", detail: "Kart geçmişi + ceza detayı" },
        { icon: "🗳️", label: "Fan Poll", detail: `"${player.name} yerine kim oynamalı?"` },
        { icon: "⏰", label: "Dönüş Postu", detail: "Ceza bitişi duyurusu hazırlığı" },
      ],
      tags: ["Story", "Poll", "Infographic"],
    };
  }

  if (s === "at_risk") {
    return {
      priority: "high",
      title: `🟨 "${player.name} Kart Sınırında!"`,
      desc: `${player.cards?.yellow}/${player.cardLimit} sarı kart — bir sonraki sarı = ceza! Maç önü dikkat çekici içerik.`,
      formats: [
        { icon: "⚠️", label: "Uyarı Story", detail: `"Dikkat! 1 kart uzağında"` },
        { icon: "📊", label: "Kart Tracker", detail: "Sezon kart istatistiği infografik" },
        { icon: "🗳️", label: "Engagement Poll", detail: `"Ceza almadan atlatabilir mi?"` },
        { icon: "🎬", label: "Faul Compilation", detail: "Tartışmalı pozisyon reels" },
      ],
      tags: ["Story", "Poll", "Reels"],
    };
  }

  if (s === "doubtful") {
    return {
      priority: "medium",
      title: `⚠️ "${player.name} Şüpheli"`,
      desc: `Maç günü kararı bekleniyor. ${player.injury || "Minör sorun"}. Engagement fırsatı!`,
      formats: [
        { icon: "🗳️", label: "Poll Story", detail: `"${player.name} oynayacak mı?"` },
        { icon: "⚡", label: "Breaking Update", detail: "Son dakika kadro açıklaması" },
        { icon: "📱", label: "Push Notification", detail: "Kadro açıklanınca bildirim" },
        { icon: "💬", label: "Thread", detail: "Oynarsa/oynamazsa analiz thread" },
      ],
      tags: ["Story", "Poll", "Push"],
    };
  }

  // fit
  return {
    priority: "low",
    title: `✅ "${player.name} Formda"`,
    desc: isBasketball
      ? "Tam performans — spotlight ve highlight kreatifi için ideal."
      : `Tam performans, ${player.cards?.yellow || 0} sarı kart. Yıldız oyuncu spotlight.`,
    formats: [
      { icon: "🌟", label: "Player Spotlight", detail: "Sezon performans özeti" },
      { icon: "📸", label: "Matchday Visual", detail: "Maç günü kadro görseli" },
      { icon: "🎥", label: "Highlight Reel", detail: "En iyi anlar derlemesi" },
      { icon: "📊", label: isBasketball ? "Stat Carousel" : "Kart/Performans", detail: isBasketball ? "Sezon istatistikleri" : "Kart bilgisi + istatistik carousel" },
    ],
    tags: ["Post", "Carousel", "Reels"],
  };
}

// ─── CARD PROGRESS BAR (Football only) ───
function CardBar({ cards, limit }) {
  if (!cards) return null;
  const pct = Math.min((cards.yellow / limit) * 100, 100);
  const isClose = cards.yellow >= limit - 1;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, width: "100%" }}>
      <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} style={{
            width: 14, height: 18, borderRadius: 2,
            background: i < cards.yellow ? "#FFCC00" : cards.red > 0 && i === 0 ? "#FF3B30" : "rgba(255,255,255,0.08)",
            border: i < cards.yellow ? "1px solid rgba(255,204,0,0.5)" : "1px solid rgba(255,255,255,0.06)",
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>
      {cards.red > 0 && (
        <div style={{
          width: 14, height: 18, borderRadius: 2,
          background: "#FF3B30", border: "1px solid rgba(255,59,48,0.5)",
          marginLeft: 4,
        }} />
      )}
      <span style={{
        fontSize: 11, fontFamily: "'Space Mono', monospace",
        color: isClose ? "#FF9500" : "rgba(255,255,255,0.3)",
        fontWeight: isClose ? 700 : 400,
      }}>
        {cards.yellow}/{limit}
        {isClose && !cards.red && " ⚠️"}
      </span>
    </div>
  );
}

// ─── MAIN APP ───
export default function InjuryPulseApp() {
  const [activeLeague, setActiveLeague] = useState("laliga");
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openCreative, setOpenCreative] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const league = LEAGUES[activeLeague];
  const isBasketball = league.sport === "basketball";

  // Global counts
  const allPlayers = Object.values(LEAGUES).flatMap(l => l.teams.flatMap(t => t.stars));
  const counts = {
    injured: allPlayers.filter(p => p.status === "injured").length,
    suspended: allPlayers.filter(p => p.status === "suspended").length,
    at_risk: allPlayers.filter(p => p.status === "at_risk").length,
    doubtful: allPlayers.filter(p => p.status === "doubtful").length,
    fit: allPlayers.filter(p => p.status === "fit").length,
  };

  // Filters
  const filterOptions = isBasketball
    ? [{ k: "all", l: "Tümü" }, { k: "injured", l: "🏥 Sakat" }, { k: "doubtful", l: "⚠️ Şüpheli" }, { k: "fit", l: "✅ Hazır" }]
    : [{ k: "all", l: "Tümü" }, { k: "injured", l: "🏥 Sakat" }, { k: "suspended", l: "🟥 Cezalı" }, { k: "at_risk", l: "🟨 Kart Riski" }, { k: "doubtful", l: "⚠️ Şüpheli" }, { k: "fit", l: "✅ Hazır" }];

  const filteredTeams = league.teams
    .map(t => ({
      ...t,
      stars: t.stars.filter(p => {
        const ms = filter === "all" || p.status === filter;
        const mq = !search || p.name.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase());
        return ms && mq;
      }),
    }))
    .filter(t => t.stars.length > 0);

  const priorityColors = { critical: "#FF3B30", high: "#FF9500", medium: "#FFCC00", low: "#30D158" };
  const priorityLabels = { critical: "KRİTİK", high: "ÖNCELİKLİ", medium: "ORTA", low: "DÜŞÜK" };

  return (
    <div style={{
      minHeight: "100vh", background: "#08080D", color: "#E4E4E9",
      fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes pulseRed { 0%,100%{box-shadow:0 0 0 0 rgba(255,59,48,.35)} 50%{box-shadow:0 0 0 7px rgba(255,59,48,0)} }
        @keyframes pulsePurple { 0%,100%{box-shadow:0 0 0 0 rgba(175,82,222,.35)} 50%{box-shadow:0 0 0 7px rgba(175,82,222,0)} }
        @keyframes pulseYellow { 0%,100%{box-shadow:0 0 0 0 rgba(255,149,0,.35)} 50%{box-shadow:0 0 0 7px rgba(255,149,0,0)} }
        @keyframes pulseAmber { 0%,100%{box-shadow:0 0 0 0 rgba(255,204,0,.35)} 50%{box-shadow:0 0 0 7px rgba(255,204,0,0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;max-height:0} to{opacity:1;max-height:900px} }
        .fade-up { animation: fadeUp .45s ease forwards; }
        .fade-up-d1 { animation: fadeUp .45s ease .08s forwards; opacity:0; }
        .fade-up-d2 { animation: fadeUp .45s ease .16s forwards; opacity:0; }
        .fade-up-d3 { animation: fadeUp .45s ease .24s forwards; opacity:0; }

        .league-btn { padding:10px 20px; border-radius:12px; border:1px solid rgba(255,255,255,.06); background:rgba(255,255,255,.025); cursor:pointer; transition:all .25s; font-size:13px; font-weight:600; color:rgba(255,255,255,.45); display:flex; align-items:center; gap:8px; white-space:nowrap; font-family:'DM Sans',sans-serif; }
        .league-btn:hover { background:rgba(255,255,255,.05); color:rgba(255,255,255,.7); }
        .league-btn.on { border-color:var(--lc); color:#fff; background:rgba(255,255,255,.06); box-shadow:0 0 24px rgba(var(--lc-rgb),.12); }

        .card { background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06); border-radius:16px; overflow:hidden; transition:all .25s; cursor:pointer; }
        .card:hover { border-color:rgba(255,255,255,.1); background:rgba(255,255,255,.035); transform:translateY(-1px); }

        .player-row { display:flex; align-items:center; gap:14px; padding:14px 20px; border-top:1px solid rgba(255,255,255,.04); transition:background .2s; }
        .player-row:hover { background:rgba(255,255,255,.025); }

        .dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }

        .creative-panel { overflow:hidden; animation:slideDown .35s ease forwards; }

        .fmt-box { padding:12px; background:rgba(255,255,255,.025); border-radius:10px; border:1px solid rgba(255,255,255,.04); transition:all .2s; }
        .fmt-box:hover { background:rgba(255,255,255,.05); border-color:rgba(255,255,255,.1); }

        .filter-pill { padding:7px 16px; border-radius:9px; border:1px solid rgba(255,255,255,.07); background:rgba(255,255,255,.025); color:rgba(255,255,255,.45); font-size:12px; font-weight:600; cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; }
        .filter-pill:hover { background:rgba(255,255,255,.05); }
        .filter-pill.on { background:rgba(255,255,255,.1); color:#fff; border-color:rgba(255,255,255,.18); }

        .search-box { background:rgba(255,255,255,.035); border:1px solid rgba(255,255,255,.07); border-radius:10px; padding:10px 16px 10px 38px; color:#fff; font-size:13px; width:100%; max-width:300px; outline:none; transition:border-color .2s; font-family:'DM Sans',sans-serif; }
        .search-box:focus { border-color:rgba(255,255,255,.18); }
        .search-box::placeholder { color:rgba(255,255,255,.2); }

        .creative-btn { padding:6px 14px; border-radius:8px; background:linear-gradient(135deg,rgba(255,255,255,.07),rgba(255,255,255,.03)); border:1px solid rgba(255,255,255,.08); color:rgba(255,255,255,.6); font-size:12px; font-weight:600; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:5px; font-family:'DM Sans',sans-serif; white-space:nowrap; }
        .creative-btn:hover { background:linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.06)); color:#fff; }

        .stat-box { background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.05); border-radius:14px; padding:18px 14px; text-align:center; }

        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08); border-radius:3px; }
      `}</style>

      {/* Ambient */}
      <div style={{ position:"fixed", top:"-25%", right:"-8%", width:550, height:550, background:`radial-gradient(circle,${league.color}12,transparent 70%)`, pointerEvents:"none", transition:"background .5s" }} />
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1, opacity:.03, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize:"180px" }} />

      <div style={{ position:"relative", zIndex:2, maxWidth:1120, margin:"0 auto", padding:"0 20px" }}>

        {/* ─── HEADER ─── */}
        <header className={mounted?"fade-up":""} style={{ padding:"30px 0 22px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:14 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:league.gradient, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:"#fff", fontWeight:800, transition:"background .3s" }}>⚕</div>
              <h1 style={{ fontSize:22, fontWeight:800, fontFamily:"'Space Mono',monospace", letterSpacing:"-0.5px" }}>
                INJURY<span style={{ color:league.color, transition:"color .3s" }}>PULSE</span>
              </h1>
              <span style={{ fontSize:10, padding:"3px 8px", borderRadius:5, background:"rgba(255,255,255,.06)", color:"rgba(255,255,255,.35)", fontWeight:700, letterSpacing:.5 }}>v2.0</span>
            </div>
            <p style={{ fontSize:12, color:"rgba(255,255,255,.3)", fontFamily:"'Space Mono',monospace" }}>
              Sakatlık + Kart Cezası Takip & Kreatif Öneri Sistemi
            </p>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.2)", fontFamily:"'Space Mono',monospace" }}>VERİ KAYNAĞI</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", fontFamily:"'Space Mono',monospace", marginTop:2 }}>
              {isBasketball ? "BasketNews + EuroLeague.net" : "Transfermarkt + SportRadar"}
            </div>
          </div>
        </header>

        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${league.color}60,transparent)`, marginBottom:22, transition:"background .5s" }} />

        {/* ─── STATS ─── */}
        <div className={mounted?"fade-up-d1":""} style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10, marginBottom:22 }}>
          {[
            { label:"Sakat", val:counts.injured, color:"#FF3B30" },
            { label:"Cezalı", val:counts.suspended, color:"#AF52DE" },
            { label:"Kart Riski", val:counts.at_risk, color:"#FF9500" },
            { label:"Şüpheli", val:counts.doubtful, color:"#FFCC00" },
            { label:"Hazır", val:counts.fit, color:"#30D158" },
          ].map(s => (
            <div key={s.label} className="stat-box">
              <div style={{ fontSize:26, fontWeight:800, color:s.color, fontFamily:"'Space Mono',monospace" }}>{s.val}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginTop:3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ─── LEAGUE TABS ─── */}
        <div className={mounted?"fade-up-d2":""} style={{ display:"flex", gap:8, marginBottom:18, overflowX:"auto", paddingBottom:3, "--lc":league.color }}>
          {Object.entries(LEAGUES).map(([k, l]) => (
            <button key={k} className={`league-btn ${activeLeague===k?"on":""}`}
              onClick={() => { setActiveLeague(k); setExpandedTeam(null); setFilter("all"); }}
              style={activeLeague===k ? { "--lc":l.color, borderColor:l.color } : {}}
            >
              <span>{l.icon}</span> {l.name}
              {l.sport==="basketball" && <span style={{ fontSize:9, background:"rgba(255,255,255,.08)", padding:"2px 6px", borderRadius:4, color:"rgba(255,255,255,.4)" }}>🏀</span>}
            </button>
          ))}
        </div>

        {/* Basketball disclaimer */}
        {isBasketball && (
          <div style={{ padding:"10px 16px", background:"rgba(242,101,34,.08)", border:"1px solid rgba(242,101,34,.15)", borderRadius:10, marginBottom:16, fontSize:12, color:"rgba(255,255,255,.5)" }}>
            🏀 <strong style={{ color:"rgba(255,255,255,.7)" }}>EuroLeague:</strong> Basketbolda kart cezası sistemi yoktur. Sadece sakatlık ve kadro durumu takibi yapılmaktadır.
            <span style={{ color:"rgba(255,255,255,.3)", marginLeft:6, fontSize:11, fontFamily:"'Space Mono',monospace" }}>Kaynak: BasketNews + EuroLeague.net</span>
          </div>
        )}

        {/* ─── FILTERS ─── */}
        <div className={mounted?"fade-up-d3":""} style={{ display:"flex", gap:8, marginBottom:22, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,.25)", fontSize:13 }}>🔍</span>
            <input className="search-box" placeholder="Oyuncu veya takım ara..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {filterOptions.map(f => (
              <button key={f.k} className={`filter-pill ${filter===f.k?"on":""}`} onClick={() => setFilter(f.k)}>{f.l}</button>
            ))}
          </div>
        </div>

        {/* ─── TEAMS ─── */}
        <div style={{ display:"flex", flexDirection:"column", gap:12, paddingBottom:50 }}>
          {filteredTeams.map((team) => {
            const open = expandedTeam === team.name;
            const inj = team.stars.filter(p => p.status==="injured").length;
            const sus = team.stars.filter(p => p.status==="suspended").length;
            const risk = team.stars.filter(p => p.status==="at_risk").length;
            const dbt = team.stars.filter(p => p.status==="doubtful").length;

            return (
              <div key={team.name} className="card" style={{ borderColor: open ? `${league.color}35` : undefined }}>
                {/* Team Header */}
                <div onClick={() => setExpandedTeam(open ? null : team.name)}
                  style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"15px 20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ fontSize:20 }}>{team.badge}</span>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700 }}>{team.name}</div>
                      <div style={{ display:"flex", gap:8, marginTop:3, flexWrap:"wrap" }}>
                        {inj > 0 && <span style={{ fontSize:11, color:"#FF3B30", fontWeight:600 }}>{inj} sakat</span>}
                        {sus > 0 && <span style={{ fontSize:11, color:"#AF52DE", fontWeight:600 }}>{sus} cezalı</span>}
                        {risk > 0 && <span style={{ fontSize:11, color:"#FF9500", fontWeight:600 }}>{risk} kart riski</span>}
                        {dbt > 0 && <span style={{ fontSize:11, color:"#FFCC00", fontWeight:600 }}>{dbt} şüpheli</span>}
                        {inj===0 && sus===0 && risk===0 && dbt===0 && <span style={{ fontSize:11, color:"#30D158", fontWeight:600 }}>Tüm yıldızlar hazır ✓</span>}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize:16, color:"rgba(255,255,255,.25)", transform:open?"rotate(180deg)":"rotate(0)", transition:"transform .25s" }}>▾</span>
                </div>

                {/* Players */}
                {open && team.stars.map((player) => {
                  const cfg = statusConfig[player.status];
                  const daysLeft = getDaysUntil(player.returnDate);
                  const creative = getCreative(player, team, league);
                  const creativeOpen = openCreative === `${team.name}::${player.name}`;

                  return (
                    <div key={player.name}>
                      <div className="player-row">
                        <div className={`dot ${cfg.pulse}`} style={{ background:cfg.color }} />
                        <div style={{ width:40, height:40, borderRadius:10, background:cfg.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                          {player.flag}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                            <span style={{ fontWeight:700, fontSize:14 }}>{player.name}</span>
                            <span style={{ fontSize:11, color:"rgba(255,255,255,.25)", fontFamily:"'Space Mono',monospace" }}>#{player.num} · {player.pos}</span>
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4, flexWrap:"wrap" }}>
                            <span style={{ padding:"2px 9px", borderRadius:6, background:cfg.bg, color:cfg.color, fontSize:11, fontWeight:700 }}>
                              {cfg.icon} {cfg.label}
                            </span>
                            {player.injury && <span style={{ fontSize:12, color:"rgba(255,255,255,.4)" }}>{player.injury}</span>}
                            {daysLeft != null && daysLeft > 0 && (
                              <span style={{ fontSize:11, color:"rgba(255,255,255,.25)", fontFamily:"'Space Mono',monospace" }}>~{daysLeft} gün</span>
                            )}
                          </div>
                          {/* Card bar for football */}
                          {!isBasketball && player.cards && <CardBar cards={player.cards} limit={player.cardLimit} />}
                        </div>
                        <button className="creative-btn"
                          onClick={e => { e.stopPropagation(); setOpenCreative(creativeOpen ? null : `${team.name}::${player.name}`); }}>
                          💡 Kreatif
                        </button>
                      </div>

                      {/* Creative Panel */}
                      {creativeOpen && (
                        <div className="creative-panel" style={{ padding:"0 20px 18px" }}>
                          <div style={{
                            background:"linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.015))",
                            border:"1px solid rgba(255,255,255,.07)",
                            borderLeft:`3px solid ${priorityColors[creative.priority]}`,
                            borderRadius:14, padding:20,
                          }}>
                            {/* Header */}
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, marginBottom:12 }}>
                              <div>
                                <div style={{ fontSize:14, fontWeight:700, marginBottom:5 }}>{creative.title}</div>
                                <div style={{ fontSize:12, color:"rgba(255,255,255,.45)", lineHeight:1.6 }}>{creative.desc}</div>
                              </div>
                              <div style={{
                                padding:"4px 10px", borderRadius:6, fontSize:10, fontWeight:800, letterSpacing:.5, whiteSpace:"nowrap",
                                background:`${priorityColors[creative.priority]}18`, color:priorityColors[creative.priority],
                              }}>
                                {priorityLabels[creative.priority]}
                              </div>
                            </div>

                            {/* Tags */}
                            <div style={{ display:"flex", gap:5, marginBottom:14, flexWrap:"wrap" }}>
                              {creative.tags.map(t => (
                                <span key={t} style={{ padding:"3px 10px", borderRadius:6, fontSize:10, fontWeight:700, letterSpacing:.4, background:"rgba(255,255,255,.05)", color:"rgba(255,255,255,.45)" }}>{t}</span>
                              ))}
                            </div>

                            {/* Formats */}
                            <div style={{ fontSize:10, color:"rgba(255,255,255,.25)", fontWeight:700, marginBottom:10, fontFamily:"'Space Mono',monospace", letterSpacing:.5 }}>
                              ÖNERİLEN KREATİF FORMATLAR
                            </div>
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                              {creative.formats.map((f, i) => (
                                <div key={i} className="fmt-box">
                                  <div style={{ fontSize:13, marginBottom:4 }}>{f.icon} <span style={{ fontWeight:600, color:"rgba(255,255,255,.75)" }}>{f.label}</span></div>
                                  <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", lineHeight:1.4 }}>{f.detail}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {filteredTeams.length === 0 && (
            <div style={{ textAlign:"center", padding:50, color:"rgba(255,255,255,.25)" }}>
              <div style={{ fontSize:36, marginBottom:10 }}>🔍</div>
              <div style={{ fontSize:13 }}>Sonuç bulunamadı</div>
            </div>
          )}
        </div>

        {/* ─── DATA SOURCE FOOTER ─── */}
        <div style={{
          padding:"24px 0 16px", borderTop:"1px solid rgba(255,255,255,.04)",
          display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20,
        }}>
          <div style={{ padding:16, background:"rgba(255,255,255,.02)", borderRadius:12, border:"1px solid rgba(255,255,255,.05)" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.5)", fontFamily:"'Space Mono',monospace", marginBottom:8 }}>⚽ FUTBOL VERİ KAYNAKLARI</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", lineHeight:1.7 }}>
              <strong style={{ color:"rgba(255,255,255,.5)" }}>Transfermarkt</strong> — Sakatlık + Ceza + Kart Riski<br/>
              <strong style={{ color:"rgba(255,255,255,.5)" }}>SportRadar</strong> — Real-time maç verisi<br/>
              <strong style={{ color:"rgba(255,255,255,.5)" }}>worldfootballR</strong> — Otomatik veri çekme
            </div>
          </div>
          <div style={{ padding:16, background:"rgba(255,255,255,.02)", borderRadius:12, border:"1px solid rgba(255,255,255,.05)" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.5)", fontFamily:"'Space Mono',monospace", marginBottom:8 }}>🏀 EUROLEAGUE VERİ KAYNAKLARI</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", lineHeight:1.7 }}>
              <strong style={{ color:"rgba(255,255,255,.5)" }}>BasketNews</strong> — Günlük sakatlık raporu<br/>
              <strong style={{ color:"rgba(255,255,255,.5)" }}>EuroLeague.net</strong> — Resmi haftalık rapor<br/>
              <strong style={{ color:"rgba(255,255,255,.5)" }}>euroleague_api</strong> — İstatistik + kadro verisi
            </div>
          </div>
        </div>

        <div style={{ padding:"12px 0 30px", textAlign:"center", fontSize:10, color:"rgba(255,255,255,.15)", fontFamily:"'Space Mono',monospace" }}>
          INJURYPULSE v2.0 — S Sport Plus Kreatif Ekibi İçin Tasarlandı
        </div>
      </div>
    </div>
  );
}
