export type City = {
	rank: string;
	city: string;
	country: string;
	population: string;
	timezone: string;
};

export type FormattedCity = {
	rank: number;
	city: string;
	country: string;
	population: number;
	timezone: Date;
};

export type Club = {
	clubName: string;
	url: string;
	[key: string]: string | null | undefined;
};

export type Clubs = {
	city: string;
	clubs: Club[];
};

export enum Countries {
	GERMANY = "germany",
	FRANCE = "france",
	ITALY = "italy",
	SPAIN = "spain",
	PORTUGAL = "portugal",
	NETHERLANDS = "netherlands",
	BELGIUM = "belgium",
	SWITZERLAND = "switzerland",
	AUSTRIA = "austria",
	POLAND = "poland",
	CZECH_REPUBLIC = "czech-republic",
	GREECE = "greece",
	SWEDEN = "sweden",
	DENMARK = "denmark",
	FINLAND = "finland",
	SLOVAKIA = "slovakia",
	NORWAY = "norway",
	IRELAND = "ireland",
	LUXEMBOURG = "luxembourg",
	ICELAND = "iceland",
	MONACO = "monaco",
	ANDORRA = "andorra",
	LIECHTENSTEIN = "liechtenstein",
	MALTA = "malta",
	UNITED_KINGDOM = "united-kingdom",
	BULGARIA = "bulgaria",
	UNITED_STATES = "usa",
}

export enum Cities {
	COLOGNE = "cologne",
	BERLIN = "berlin",
	BIRMINGHAM = "birmingham",
	BRUSSELS = "brussels",
	HAMBURG = "hamburg",
	PRAGUE = "prague",
	COPENHAGEN = "copenhagen",
	AMSTERDAM = "amsterdam",
	BUDAPEST = "budapest",
	MUNICH = "munich",
	VIENNA = "vienna",
	LISBON = "lisbon",
	LONDON = "london",
	MADRID = "madrid",
	FRANKFURT = "frankfurt",
	BARCELONA = "barcelona",
	ROTTERDAM = "rotterdam",
	STOCKHOLM = "stockholm",
	SEVILLA = "sevilla",
	PARIS = "paris",
	OSLO = "oslo",
	DUESSELDORF = "duesseldorf",
	DUBLIN = "dublin",
	NUREMBERG = "nuremberg",
	DRESDEN = "dresden",
	KRAKOW = "krakow",
	WARSAW = "warsaw",
	MILAN = "milan",
	SOFIA = "sofia",
	SAN_FRANCISCO = "san-francisco",
}
