/* Todo: replace this fetch from BFF. Including types. */
interface OrganisationBody {
  orgs: {
    [orgId: string]: Organisation;
  };
}

interface Organisation {
  name: {
    [locale: string]: string;
  };
  orgnr: string;
  homepage: string;
  environments: string[];
  logo?: string;
}

interface OrganisationOutput {
  name: string;
  logo?: string;
}

export const getOrganisation = (org: string, locale: string): OrganisationOutput | undefined => {
  const name = organisations.orgs[org]?.name?.[locale];
  const logo = organisations.orgs[org]?.logo;
  if (name) {
    return {
      name,
      logo,
    };
  }
};

const organisations: OrganisationBody = {
  orgs: {
    brg: {
      name: {
        en: 'Brønnøysund Register Centre',
        nb: 'Brønnøysundregistrene',
        nn: 'Brønnøysundregistera',
      },
      logo: 'https://altinncdn.no/orgs/brg/brreg.png',
      orgnr: '974760673',
      homepage: 'https://www.brreg.no',
      environments: ['tt02', 'production'],
    },
    buf: {
      name: {
        en: 'The Norwegian Directorate for Children, Youth and Family Affairs',
        nb: 'Barne-, ungdoms- og familiedirektoratet',
        nn: 'Barne-, ungdoms- og familiedirektoratet',
      },
      logo: 'https://altinncdn.no/orgs/buf/buf.png',
      orgnr: '986128433',
      homepage: 'https://www.bufdir.no',
      environments: ['tt02'],
    },
    dat: {
      name: {
        en: 'Norwegian Labour Inspection Authority',
        nb: 'Arbeidstilsynet',
        nn: 'Arbeidstilsynet',
      },
      logo: 'https://altinncdn.no/orgs/dat/arbeidstilsynet.png',
      orgnr: '974761211',
      homepage: 'https://www.arbeidstilsynet.no',
      environments: ['tt02', 'production'],
    },
    dibk: {
      name: {
        en: 'Norwegian Building Authority',
        nb: 'Direktoratet for byggkvalitet',
        nn: 'Direktoratet for byggkvalitet',
      },
      logo: 'https://altinncdn.no/orgs/dibk/dibk.png',
      orgnr: '974760223',
      homepage: 'https://dibk.no',
      environments: ['tt02', 'production'],
    },
    digdir: {
      name: {
        en: 'Norwegian Digitalisation Agency',
        nb: 'Digitaliseringsdirektoratet',
        nn: 'Digitaliseringsdirektoratet',
      },
      logo: '',
      orgnr: '991825827',
      homepage: 'https://www.digdir.no',
      environments: ['tt02', 'production'],
    },
    dihe: {
      name: {
        en: 'Digital Helgeland ',
        nb: 'Digitale Helgeland',
        nn: 'Digitale Helgeland',
      },
      logo: '',
      orgnr: '964983291',
      homepage: 'https://digihelgeland.no/',
      environments: ['tt02', 'production'],
    },
    dmf: {
      name: {
        en: 'The Directorate of Mining',
        nb: 'Direktoratet for mineralforvaltning',
        nn: 'Direktoratet for mineralforvaltning',
      },
      logo: 'https://altinncdn.no/orgs/dmf/dmf.png',
      orgnr: '974760282',
      homepage: 'https://dirmin.no/',
      environments: ['tt02', 'production'],
    },
    dsb: {
      name: {
        en: 'The Norwegian Directorate for Civil Protection',
        nb: 'Direktoratet for samfunnssikkerhet og beredskap',
        nn: 'Direktoratet for samfunnssikkerhet og beredskap',
      },
      logo: 'https://altinncdn.no/orgs/dsb/dsb.png',
      orgnr: '974760983',
      homepage: 'https://www.dsb.no/',
      environments: ['tt02', 'production'],
    },
    fd: {
      name: {
        en: 'The Norwegian Directorate of Fisheries',
        nb: 'Fiskeridirektoratet',
        nn: 'Fiskeridirektoratet',
      },
      logo: 'https://altinncdn.no/orgs/fd/fiskeridirektoratet.png',
      orgnr: '971203420',
      homepage: 'https://www.fiskeridir.no/',
      environments: ['tt02', 'production'],
    },
    fhi: {
      name: {
        en: 'The Norwegian Institute of Public Health',
        nb: 'Folkehelseinstituttet',
        nn: 'Folkehelseinstituttet',
      },
      logo: 'https://altinncdn.no/orgs/fhi/fhi.png',
      orgnr: '983744516',
      homepage: 'https://www.fhi.no/',
      environments: ['tt02', 'production'],
    },
    fors: {
      name: {
        en: 'The Norwegian Armed Forces',
        nb: 'Forsvaret',
        nn: 'Forsvaret',
      },
      logo: 'https://altinncdn.no/orgs/fors/fors.png',
      orgnr: '986105174',
      homepage: 'https://www.forsvaret.no/',
      environments: ['tt02'],
    },
    gk: {
      name: {
        en: 'The Criminal Cases Review Commission',
        nb: 'Gjenopptakelseskommisjonen',
        nn: 'Gjenopptakingskommisjonen',
      },
      logo: 'https://altinncdn.no/orgs/gk/gjenopptakelseskommisjonen.png',
      orgnr: '985847215',
      homepage: 'https://www.gjenopptakelse.no/',
      environments: ['tt02', 'production'],
    },
    hdir: {
      name: {
        en: 'Norwegian Directorate of Health',
        nb: 'Helsedirektoratet',
        nn: 'Helsedirektoratet',
      },
      logo: 'https://altinncdn.no/orgs/hdir/helsedirektoratet.png',
      orgnr: '983544622',
      homepage: 'https://www.helsedirektoratet.no',
      environments: ['tt02'],
    },
    hi: {
      name: {
        en: 'Institute of Marine Research',
        nb: 'Havforskningsinstituttet',
        nn: 'Havforskningsinstituttet',
      },
      logo: 'https://altinncdn.no/orgs/hi/havforskningsinstituttet.png',
      orgnr: '971349077',
      homepage: 'https://www.hi.no/',
      environments: ['tt02', 'production'],
    },
    hmrhf: {
      name: {
        en: 'Helse Møre og Romsdal',
        nb: 'Helse Møre og Romsdal',
        nn: 'Helse Møre og Romsdal',
      },
      logo: 'https://altinncdn.no/orgs/hmrhf/hmrhf.png',
      orgnr: '997005562',
      homepage: 'https://helse-mr.no',
      environments: ['tt02', 'production'],
    },
    indi: {
      name: {
        en: 'Indigo IKT IKS',
        nb: 'Indigo IKT IKS',
        nn: 'Indigo IKT IKS',
      },
      logo: 'https://altinncdn.no/orgs/indi/indi.png',
      orgnr: '930283487',
      homepage: 'https://www.indigo-ikt.no/',
      environments: ['tt02'],
    },
    k1103: {
      name: {
        en: 'The municipality of Stavanger',
        nb: 'Stavanger kommune',
        nn: 'Stavanger kommune',
      },
      logo: 'https://altinncdn.no/orgs/k1103/k1103.png',
      orgnr: '964965226',
      homepage: 'https://www.stavanger.kommune.no/',
      environments: ['tt02'],
    },
    krt: {
      name: {
        en: 'The Financial Supervisory Authority of Norway',
        nb: 'Finanstilsynet',
        nn: 'Finanstilsynet',
      },
      logo: 'https://altinncdn.no/orgs/krt/krt.png',
      orgnr: '840747972',
      homepage: 'https://www.finanstilsynet.no',
      environments: ['tt02', 'production'],
    },
    kv: {
      name: {
        en: 'Norwegian Mapping Authority',
        nb: 'Kartverket',
        nn: 'Kartverket',
      },
      logo: 'https://altinncdn.no/orgs/kv/kartverket.png',
      orgnr: '971040238',
      homepage: 'https://www.kartverket.no/',
      environments: ['tt02', 'production'],
    },
    kyv: {
      name: {
        en: 'The Norwegian Coastal Administration',
        nb: 'Kystverket',
        nn: 'Kystverket',
      },
      logo: 'https://altinncdn.no/orgs/kyv/kyv.png',
      orgnr: '874783242',
      homepage: 'https://www.kystverket.no/',
      environments: ['tt02', 'production'],
    },
    lt: {
      name: {
        en: 'Civil Aviation Authority of Norway',
        nb: 'Luftfartstilsynet',
        nn: 'Luftfartstilsynet',
      },
      logo: 'https://altinncdn.no/orgs/lt/lt.png',
      orgnr: '981105516',
      homepage: 'https://luftfartstilsynet.no',
      environments: ['tt02', 'production'],
    },
    mat: {
      name: {
        en: 'Norwegian Food Safety Authority',
        nb: 'Mattilsynet',
        nn: 'Mattilsynet',
      },
      logo: 'https://altinncdn.no/orgs/mat/mat.png',
      orgnr: '985399077',
      homepage: 'https://www.mattilsynet.no/',
      environments: ['tt02', 'production'],
    },
    mdir: {
      name: {
        en: 'Norwegian Environment Agency',
        nb: 'Miljødirektoratet',
        nn: 'Miljødirektoratet',
      },
      logo: 'https://altinncdn.no/orgs/mdir/mdir.png',
      orgnr: '999601391',
      homepage: 'https://www.miljodirektoratet.no/',
      environments: ['tt02'],
    },
    nb: {
      name: {
        en: 'Norges Bank',
        nb: 'Norges Bank',
        nn: 'Noregs Bank',
      },
      logo: 'https://altinncdn.no/orgs/nb/norgesbank.png',
      orgnr: '937884117',
      homepage: 'https://www.norges-bank.no/',
      environments: ['tt02'],
    },
    nbib: {
      name: {
        en: 'National Library of Norway',
        nb: 'Nasjonalbiblioteket',
        nn: 'Nasjonalbiblioteket',
      },
      logo: 'https://altinncdn.no/orgs/nbib/nasjonalbiblioteket.png',
      orgnr: '976029100',
      homepage: 'https://www.nb.no',
      environments: ['tt02', 'production'],
    },
    nhn: {
      name: {
        en: 'Norwegian Healthnet',
        nb: 'Norsk helsenett',
        nn: 'Norsk helsenett',
      },
      logo: 'https://altinncdn.no/orgs/nhn/nhn.png',
      orgnr: '994598759',
      homepage: 'https://www.nhn.no/',
      environments: ['tt02'],
    },
    nkom: {
      name: {
        en: 'The Norwegian Communications Authority',
        nb: 'Nasjonal kommunikasjonsmyndighet',
        nn: 'Nasjonal kommunikasjonsmyndighet',
      },
      logo: 'https://altinncdn.no/orgs/nkom/nkom.png',
      orgnr: '974446871',
      homepage: 'https://www.nkom.no/',
      environments: ['tt02', 'production'],
    },
    nkr: {
      name: {
        en: 'Arts Council Norway',
        nb: 'Kulturrådet',
        nn: 'Kulturrådet',
      },
      logo: 'https://altinncdn.no/orgs/nkr/kulturradet.png',
      orgnr: '971527412',
      homepage: 'https://www.kulturradet.no',
      environments: ['tt02'],
    },
    nav: {
      name: {
        en: 'Norwegian Labour and Welfare Administration (NAV)',
        nb: 'Arbeids- og velferdsetaten (NAV)',
        nn: 'Arbeids- og velferdsetaten (NAV)',
      },
      logo: 'https://altinncdn.no/orgs/nav/nav.png',
      orgnr: '889640782',
      homepage: 'https://www.nav.no',
      environments: ['tt02'],
    },
    npe: {
      name: {
        en: 'Norwegian System of Patient Injury Compensation',
        nb: 'Norsk pasientskadeerstatning',
        nn: 'Norsk pasientskadeerstatning',
      },
      logo: 'https://altinncdn.no/orgs/npe/npe.png',
      orgnr: '984936923',
      homepage: 'https://www.npe.no',
      environments: ['tt02'],
    },
    nsm: {
      name: {
        en: 'National Security Agency',
        nb: 'Nasjonal sikkerhetsmyndighet',
        nn: 'Nasjonal sikkerhetsmyndighet',
      },
      logo: 'https://altinncdn.no/orgs/nsm/nsm.png',
      orgnr: '985165262',
      homepage: 'https://www.nsm.no',
      environments: ['tt02'],
    },
    oed: {
      name: {
        en: 'Ministry of Petroleum and Energy',
        nb: 'Olje- og energidepartementet',
        nn: 'Olje- og energidepartementet',
      },
      logo: 'https://altinncdn.no/orgs/oed/oed.png',
      orgnr: '977161630',
      homepage: 'https://www.regjeringen.no/no/dep/oed/',
      environments: ['tt02', 'production'],
    },
    oko: {
      name: {
        en: 'National Authority for Investigation and Prosecution of Economic and Environmental Crime',
        nb: 'Økokrim',
        nn: 'Økokrim',
      },
      logo: 'https://altinncdn.no/orgs/oko/oko.png',
      orgnr: '874761532',
      homepage: 'https://www.okokrim.no/',
      environments: ['tt02'],
    },
    pat: {
      name: {
        en: 'Norwegian Industrial Property Office',
        nb: 'Patentstyret',
        nn: 'Patentstyret',
      },
      logo: 'https://altinncdn.no/orgs/pat/pat.png',
      orgnr: '971526157',
      homepage: 'https://www.patentstyret.no/',
      environments: ['tt02', 'production'],
    },
    sfd: {
      name: {
        en: 'Norwegian Maritime Authority',
        nb: 'Sjøfartsdirektoratet',
        nn: 'Sjøfartsdirektoratet',
      },
      logo: 'https://altinncdn.no/orgs/sfd/sfd.png',
      orgnr: '974761262',
      homepage: 'https://www.sdir.no',
      environments: ['tt02'],
    },
    sfvt: {
      name: {
        en: 'County Governor of Vestfold and Telemark',
        nb: 'Statsforvalteren i Vestfold og Telemark',
        nn: 'Statsforvaltaren i Vestfold og Telemark',
      },
      logo: 'https://altinncdn.no/orgs/sfvt/sfvt.png',
      orgnr: '974762501',
      homepage: 'https://www.statsforvalteren.no/nb/vestfold-og-telemark/',
      environments: ['tt02', 'production'],
    },
    skd: {
      name: {
        en: 'Norwegian Tax Administration',
        nb: 'Skatteetaten',
        nn: 'Skatteetaten',
      },
      logo: 'https://altinncdn.no/orgs/skd/skd.png',
      orgnr: '974761076',
      homepage: 'https://www.skatteetaten.no',
      environments: ['tt02', 'yt01', 'production'],
    },
    srf: {
      name: {
        en: 'Norwegian Civil Affairs Authority',
        nb: 'Statens Sivilrettsforvaltning',
        nn: 'Statens Sivilrettsforvaltning',
      },
      logo: 'https://altinncdn.no/orgs/srf/srf.png',
      orgnr: '986186999',
      homepage: 'https://www.sivilrett.no',
      environments: ['tt02', 'production'],
    },
    ssb: {
      name: {
        en: 'Statistics Norway',
        nb: 'Statistisk sentralbyrå',
        nn: 'Statistisk sentralbyrå',
      },
      logo: 'https://altinncdn.no/orgs/ssb/ssb_dark.png',
      orgnr: '971526920',
      homepage: 'https://www.ssb.no',
      environments: ['tt02', 'production'],
    },
    staf: {
      name: {
        en: 'County Governor',
        nb: 'Statsforvalterens fellestjenester',
        nn: 'Statsforvaltarens fellestjenester',
      },
      logo: 'https://altinncdn.no/orgs/staf/staf.png',
      orgnr: '921627009',
      homepage: 'https://www.statsforvalteren.no/staf/',
      environments: ['tt02'],
    },
    stami: {
      name: {
        en: 'The National Institute of Occupational Health',
        nb: 'Statens arbeidsmiljøinstitutt',
        nn: 'Statens arbeidsmiljøinstitutt',
      },
      logo: 'https://altinncdn.no/orgs/stami/stami.png',
      orgnr: '874761222',
      homepage: 'https://stami.no/',
      environments: ['tt02', 'production'],
    },
    svv: {
      name: {
        en: 'The Norwegian Public Roads Administration',
        nb: 'Statens vegvesen',
        nn: 'Statens vegvesen',
      },
      logo: 'https://altinncdn.no/orgs/svv/svv.png',
      orgnr: '971032081',
      homepage: 'https://vegvesen.no/',
      environments: ['tt02', 'production'],
    },
    tad: {
      name: {
        en: 'Norwegian Customs',
        nb: 'Tolletaten',
        nn: 'Tolletaten',
      },
      logo: 'https://altinncdn.no/orgs/tad/tad.png',
      orgnr: '880455702',
      homepage: 'https://www.toll.no/',
      environments: ['tt02', 'production'],
    },
    tra: {
      name: {
        en: 'The Supervisory Council for Legal Practice',
        nb: 'Tilsynsrådet for advokatvirksomhet',
        nn: 'Tilsynsrådet for advokatverksemd',
      },
      logo: 'https://altinncdn.no/orgs/tra/tra.png',
      orgnr: '914459265',
      homepage: 'https://tilsynet.no/',
      environments: ['tt02'],
    },
    ttd: {
      name: {
        en: 'Test Ministry',
        nb: 'Testdepartementet',
        nn: 'Testdepartementet',
      },
      logo: 'https://altinncdn.no/orgs/udi/udi.png',
      orgnr: '',
      homepage: '',
      environments: ['at21', 'at22', 'at23', 'at24', 'tt02', 'yt01', 'production'],
    },
    udi: {
      name: {
        en: 'The Norwegian Directorate of Immigration',
        nb: 'Utlendingsdirektoratet',
        nn: 'Utlendingsdirektoratet',
      },
      logo: 'https://altinncdn.no/orgs/udi/udi.png',
      orgnr: '974760746',
      homepage: 'https://www.udi.no',
      environments: ['tt02', 'production'],
    },
    udir: {
      name: {
        en: 'Norwegian Directorate for Education and Training',
        nb: 'Utdanningsdirektoratet',
        nn: 'Utdanningsdirektoratet',
      },
      logo: 'https://altinncdn.no/orgs/udir/udir.png',
      orgnr: '970018131',
      homepage: 'https://www.udir.no',
      environments: ['tt02', 'production'],
    },
    valg: {
      name: {
        en: 'Election Directorate',
        nb: 'Valgdirektoratet',
        nn: 'Valdirektoratet',
      },
      logo: 'https://altinncdn.no/orgs/valg/valg.png',
      orgnr: '916132727',
      homepage: 'https://www.valg.no',
      environments: ['tt02', 'production'],
    },
    dfo: {
      name: {
        en: 'The Norwegian Agency for Public and Financial Management (DFØ)',
        nb: 'Direktoratet for forvaltning og økonomistyring',
        nn: 'Direktoratet for forvaltning og økonomistyring',
      },
      orgnr: '986252932',
      homepage: 'https://dfo.no/',
      environments: [],
    },
    slk: {
      name: {
        en: 'Norwegian State Educational Loan Fund',
        nb: 'Statens Lånekasse for utdanning',
        nn: 'Statens Lånekasse for utdanning',
      },
      orgnr: '960885406',
      homepage: 'https://lanekassen.no/',
      environments: [],
    },
    kt: {
      name: {
        en: 'Norwegian Competition Authority',
        nb: 'Konkurransetilsynet',
        nn: 'Konkurransetilsynet',
      },
      orgnr: '974761246',
      homepage: 'https://konkurransetilsynet.no/',
      environments: [],
    },
    hb: {
      name: {
        en: 'Norwegian State Housing Bank',
        nb: 'Husbanken',
        nn: 'Husbanken',
      },
      orgnr: '942114184',
      homepage: 'https://www.husbanken.no/',
      environments: [],
    },
    lts: {
      name: {
        en: 'Norwegian Gaming and Foundation Authority',
        nb: 'Lotteri- og stiftelsestilsynet',
        nn: 'Lotteri- og stiftelsestilsynet',
      },
      orgnr: '982391490',
      homepage: 'https://lottstift.no/',
      environments: [],
    },
    slf: {
      name: {
        en: 'Norwegian Agriculture Agency',
        nb: 'Landbruksdirektoratet',
        nn: 'Landbruksdirektoratet',
      },
      orgnr: '981544315',
      homepage: 'https://www.landbruksdirektoratet.no/',
      environments: [],
    },
    nve: {
      name: {
        en: 'Norwegian Water Resources and Energy Directorate',
        nb: 'Norges vassdrags- og energidirektorat',
        nn: 'Norges vassdrags- og energidirektoratt',
      },
      orgnr: '970205039',
      homepage: 'https://www.nve.no/',
      environments: [],
    },
    ok: {
      name: {
        en: 'City of Oslo',
        nb: 'Oslo kommune',
        nn: 'Oslo kommune',
      },
      orgnr: '971183675',
      homepage: 'https://www.oslo.kommune.no/',
      environments: [],
    },
    bk: {
      name: {
        en: 'City of Bergen',
        nb: 'Bergen kommune',
        nn: 'Bergen kommune',
      },
      orgnr: '964338531',
      homepage: 'https://www.bergen.kommune.no/',
      environments: [],
    },
    spk: {
      name: {
        en: 'Norwegian Public Service Pension Fund',
        nb: 'Statens pensjonskasse',
        nn: 'Statens pensjonskasse',
      },
      orgnr: '974760967',
      homepage: 'https://www.spk.no/',
      environments: [],
    },
    ks: {
      name: {
        en: 'Municipalities/County Municipalities',
        nb: 'Kommuner/fylkeskommuner',
        nn: 'Kommunar/fylkeskommunar',
      },
      orgnr: '971032146',
      homepage: 'https://www.ks.no/',
      environments: [],
    },
    dpa: {
      name: {
        en: 'Norwegian Data Protection Authority',
        nb: 'Datatilsynet',
        nn: 'Datatilsynet',
      },
      orgnr: '974761467',
      homepage: 'https://www.datatilsynet.no/',
      environments: [],
    },
    pod: {
      name: {
        en: 'Police',
        nb: 'Politiet',
        nn: 'Politiet',
      },
      orgnr: '982531950',
      homepage: 'https://www.datatilsynet.no/',
      environments: [],
    },
    sht: {
      name: {
        en: 'Accident Investigation Board Norway',
        nb: 'Statens havarikommisjon',
        nn: 'Statens havarikommisjon',
      },
      orgnr: '881143712',
      homepage: 'https://havarikommisjonen.no/',
      environments: [],
    },
    eno: {
      name: {
        en: 'Enova SF',
        nb: 'Enova SF',
        nn: 'Enova SF',
      },
      orgnr: '983609155',
      homepage: 'https://www.enova.no/',
      environments: [],
    },
    k5501: {
      name: {
        en: 'Trondheim Municipality',
        nb: 'Trondheim kommune',
        nn: 'Trondheim kommune',
      },
      orgnr: '942110464',
      homepage: 'https://www.trondheim.kommune.no/',
      environments: [],
    },
    k3030: {
      name: {
        en: 'Lillestrøm kommune',
        nb: 'Lillestrøm kommune',
        nn: 'Lillestrøm kommune',
      },
      orgnr: '820710592',
      homepage: 'https://www.lillestrom.kommune.no/',
      environments: [],
    },
    ikta: {
      name: {
        en: 'IKT Agder IKS',
        nb: 'IKT Agder IKS',
        nn: 'IKT Agder IKS',
      },
      orgnr: '985359385',
      homepage: 'https://www.ikt-agder.no/',
      environments: [],
    },
    nokut: {
      name: {
        en: 'The Norwegian Agency for Quality Assurance in Education',
        nb: 'Nasjonalt organ for kvalitet i utdanningen',
        nn: 'Nasjonalt organ for kvalitet i utdanninga',
      },
      orgnr: '985042667',
      homepage: 'https://www.nokut.no/',
      environments: [],
    },
    pol: {
      name: {
        en: 'The Norwegian Police Service',
        nb: 'Politi- og lensmannsetaten',
        nn: 'Politi- og lensmannsetaten',
      },
      orgnr: '915429785',
      homepage: 'https://www.politiet.no/',
      environments: [],
    },
    afs: {
      name: {
        en: 'Avfall Sør AS',
        nb: 'Avfall Sør AS',
        nn: 'Avfall Sør AS',
      },
      orgnr: '995646137',
      homepage: 'https://avfallsor.no/',
      environments: [],
    },
    fjel: {
      name: {
        en: 'Fjellinjen AS',
        nb: 'Fjellinjen AS',
        nn: 'Fjellinjen AS',
      },
      orgnr: '941856543',
      homepage: 'https://www.fjellinjen.no/',
      environments: [],
    },
    vigo: {
      name: {
        en: 'VIGO IKS',
        nb: 'VIGO IKS',
        nn: 'VIGO IKS',
      },
      orgnr: '998283914',
      homepage: 'https://www.vigoiks.no/',
      environments: [],
    },
    rmt: {
      name: {
        en: 'Remidt IKS',
        nb: 'Remidt IKS',
        nn: 'Remidt IKS',
      },
      orgnr: '975936333',
      homepage: 'https://www.remidt.no/',
      environments: [],
    },
    mna: {
      name: {
        en: 'MIDTRE NAMDAL AVFALLSSELSKAP IKS',
        nb: 'MIDTRE NAMDAL AVFALLSSELSKAP IKS',
        nn: 'MIDTRE NAMDAL AVFALLSSELSKAP IKS',
      },
      orgnr: '957387969',
      homepage: 'https://mna.no/',
      environments: [],
    },
  },
};
