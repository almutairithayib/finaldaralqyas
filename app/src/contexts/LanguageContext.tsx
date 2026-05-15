import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface Translations {
  [key: string]: {
    [key: string]: string | any;
  };
}

const translations: Translations = {
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'من نحن',
      services: 'خدماتنا',
      clients: 'عملائنا',
      projects: 'مشاريعنا',
      contact: 'تواصل معنا',
      requestConsult: 'طلب استشارة'
    },
    hero: {
      title: 'حلول هندسية مبتكرة ومستدامة',
      subtitle: 'نقدم أعلى مستويات الخدمات الهندسية والمهنية وفق أعلى المعايير المحلية والدولية',
      cta: 'اكتشف خدماتنا'
    },
    about: {
      tag: '01 / من نحن',
      vision: 'رؤيتنا',
      visionText: 'أن نكون من الشركات الرائدة في مجال الاستشارات الهندسية والمهنية في المنطقة، مع تقديم خدمات عالية الجودة تتسم بالاحترافية والدقة، وتدعم أهداف التنمية العمرانية والاقتصادية.',
      mission: 'رسالتنا',
      missionText: 'تقديم حلول هندسية مبتكرة وشاملة تلبي احتياجات عملائنا، وتوفر بيئات عمرانية وظيفية ومستدامة من خلال استخدام أفضل البرامج الهندسية، الممارسات المهنية، والإشراف الدقيق.',
      stats: 'مشروع منجز'
    },
    services: {
      tag: '02 / خدماتنا',
      desc: 'تتميز دار القياس بتوفيرها حزمة من الخدمات الهندسية المتخصصة',
      items: [
        {
          title: 'التصميم المعماري والإنشائي',
          desc: 'تقديم حلول ابتكارية تشمل تطوير المفاهيم الأولية، إعداد المخططات التفصيلية، وتصاميم المنشآت المعدنية.',
          sub: ['تصميم معماري متكامل', 'تصميم إنشائي وهيكلي', 'تصميم منشآت معدنية']
        },
        {
          title: 'التصميم الكهروميكانيكي (MEP)',
          desc: 'تصميم أنظمة التكييف والتهوية، الأنظمة الكهربائية، وأنظمة الصرف الصحي والإطفاء.',
          sub: ['أنظمة HVAC', 'الكهرباء والتيار المنخفض', 'الصرف الصحي والمياه']
        },
        {
          title: 'إدارة المشاريع والإشراف',
          desc: 'إدارة شاملة تضمن التحكم في التكلفة والجودة، متابعة التنفيذ الميداني، والالتزام بالجداول الزمنية.',
          sub: ['إشراف هندسي ميداني', 'إدارة التكلفة والجودة', 'الجداول الزمنية']
        },
        {
          title: 'خدمات المساحة والرفع الهندسي',
          desc: 'خدمات مساحية متقدمة تشمل الرفع المساحي المربوط بأنظمة GPS، فرز ودمج الأراضي.',
          sub: ['الرفع المساحي والـ GPS', 'فرز ودمج الأراضي', 'تعديل الصكوك']
        },
        {
          title: 'مراجعة التصاميم والكود السعودي',
          desc: 'مراجعة دقيقة للمخططات للتأكد من مطابقتها لكود البناء السعودي والمعايير الهندسية.',
          sub: ['مطابقة الكود السعودي', 'مراجعة المخططات', 'مراجعة خطط السلامة']
        },
        {
          title: 'نمذجة معلومات المباني (BIM)',
          desc: 'استخدام تكنولوجيا BIM للتنسيق بين التخصصات، المحاكاة ثلاثية الأبعاد، وتخطيط مراحل التنفيذ.',
          sub: ['تنسيق التخصصات', 'المحاكاة ثلاثية الأبعاد', 'تخطيط مراحل التنفيذ']
        },
        {
          title: 'إصدار التراخيص والرخص',
          desc: 'نوفر جميع أنواع التراخيص المهنية بما في ذلك رخص البناء السكني والتجاري ورخص التعديل.',
          sub: ['رخص البناء', 'رخص التعديل', 'دعم الإجراءات الحكومية']
        },
        {
          title: 'خدمات السلامة والدفاع المدني',
          desc: 'إعداد إجراءات السلامة للمواقع بما يتوافق مع متطلبات الدفاع المدني وإصدار شهادات الاعتماد.',
          sub: ['الدفاع المدني', 'إجراءات السلامة التشغيلية', 'شهادات الاعتماد']
        },
        {
          title: 'الدراسات البيئية وتقييم الأثر',
          desc: 'تحليل التأثيرات البيئية للمشاريع لضمان الالتزام باللوائح البيئية وتحقيق التنمية المستدامة.',
          sub: ['تقييم الأثر البيئي', 'تصاريح المشاريع الصناعية', 'حماية البيئة المحيطة']
        }
      ]
    },
    clients: {
      tag: '03 / شركاء النجاح',
      title: 'نفخر بثقة نخبة من العملاء والشركاء',
      sectors: {
        gov: 'القطاع الحكومي وشبه الحكومي',
        corp: 'الشركات المدرجة في سوق الأسهم',
        fin: 'القطاع المالي والعقاري',
        misc: 'مشاريع القطاعات المختلفة'
      }
    },
    projects: {
      tag: '04 / مشاريعنا',
      title: 'مشاريع مماثلة لنطاق العمل',
      items: [
        { client: 'شركة الخريف', title: 'فندق سنترو روتانا - حائل', desc: 'أحد مشاريع الضيافة الحديثة في مدينة حائل، يتميز بتصميم عصري يلائم احتياجات رجال الأعمال والعائلات', tags: ['تصميم', 'إشراف'], image: '/projects/hotel.jpg' },
        { client: 'شركة قلائد', title: 'برج قلائد - الرياض', desc: 'برج مكتبي حديث على طريق الملك سلمان يوفر مساحات عمل مرنة بمستويات عالية من الجودة', tags: ['إشراف'], image: '/projects/tower.jpg' },
        { client: 'شركة الخريف', title: 'مشروع المحور - الرمال', desc: 'مجمع تجاري في حي الرمال بالرياض ضمن نطاق العصب التجاري للمنطقة', tags: ['تصميم', 'إشراف'], image: '/projects/mall.jpg' },
        { client: 'هيئة الزكاة', title: 'هيئة الزكاة والضريبة والجمارك', desc: 'مراجعة الأعمال المساحية والتأكد من نقاط الرفع وتحديثها لجميع المنافذ البرية', tags: ['مساحة'], image: '/projects/border.jpg' },
        { client: 'سبارك', title: 'مدينة الملك سلمان للطاقة', desc: 'فحص وتقييم حالة محطات وخطوط نقل الكهرباء والبنية التحتية', tags: ['استشارات'], image: '/projects/energy.jpg' },
        { client: 'نيوم', title: 'نيوم', desc: 'الدراسة المكانية والعقارية لأغراض النزع', tags: ['مساحة', 'عقارات'], image: '/projects/neom.jpg' }
      ]
    },
    contact: {
      tag: '05 / تواصل معنا',
      title: 'ابدأ مشروعك معنا',
      subtitle: 'نحن هنا لمساعدتك في تحقيق رؤيتك. تواصل مع فريقنا للحصول على استشارة مخصصة.',
      whatsapp: 'تواصل معنا عبر الواتساب',

      location: 'الرياض، المملكة العربية السعودية'
    },
    footer: {
      name: 'دار القياس للاستشارات المهنية',
      rights: 'جميع الحقوق محفوظة.',
      builtBy: 'تصميم وبناء'
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      services: 'Services',
      clients: 'Clients',
      projects: 'Projects',
      contact: 'Contact Us',
      requestConsult: 'Request Consultation'
    },
    hero: {
      title: 'Innovative & Sustainable Engineering Solutions',
      subtitle: 'We provide the highest levels of engineering and professional services according to local and international standards.',
      cta: 'Explore Services'
    },
    about: {
      tag: '01 / About Us',
      vision: 'Our Vision',
      visionText: 'To be among the leading companies in the field of engineering and professional consulting in the region, providing high-quality services characterized by professionalism and accuracy, supporting urban and economic development goals.',
      mission: 'Our Mission',
      missionText: 'Providing innovative and comprehensive engineering solutions that meet our clients\' needs, providing functional and sustainable urban environments through the use of the best engineering software, professional practices, and careful supervision.',
      stats: 'Completed Project'
    },
    services: {
      tag: '02 / Our Services',
      desc: 'Dar Al Qiyas is distinguished by providing a package of specialized engineering services.',
      items: [
        {
          title: 'Architectural & Structural Design',
          desc: 'Providing innovative solutions including concept development, detailed drawings, and steel structure designs.',
          sub: ['Integrated Architecture', 'Structural Engineering', 'Steel Structure Design']
        },
        {
          title: 'Electromechanical Design (MEP)',
          desc: 'Design of HVAC systems, electrical systems, and plumbing and fire fighting systems.',
          sub: ['HVAC Systems', 'Electrical & Low Current', 'Plumbing & Water']
        },
        {
          title: 'Project Management & Supervision',
          desc: 'Comprehensive management ensuring cost and quality control, field execution follow-up, and schedule adherence.',
          sub: ['Field Supervision', 'Cost & Quality Management', 'Project Scheduling']
        },
        {
          title: 'Surveying & Engineering Mapping',
          desc: 'Advanced surveying services including GPS-linked mapping, land division, and consolidation.',
          sub: ['GPS Surveying', 'Land Subdivision', 'Title Deed Modification']
        },
        {
          title: 'Design Review & Saudi Code',
          desc: 'Thorough review of plans to ensure compliance with the Saudi Building Code and engineering standards.',
          sub: ['SBC Compliance', 'Drawings Review', 'Safety Plans Review']
        },
        {
          title: 'Building Information Modeling (BIM)',
          desc: 'Using BIM technology for interdisciplinary coordination, 3D simulation, and execution planning.',
          sub: ['Interdisciplinary Coordination', '3D Simulation', 'Execution Planning']
        },
        {
          title: 'Licenses & Permits Issuance',
          desc: 'Providing all types of professional licenses including residential/commercial building and modification permits.',
          sub: ['Building Permits', 'Modification Permits', 'Government Support']
        },
        {
          title: 'Safety & Civil Defense Services',
          desc: 'Preparing site safety procedures in compliance with Civil Defense requirements and issuing certifications.',
          sub: ['Civil Defense', 'Operational Safety', 'Certification Issuance']
        },
        {
          title: 'Environmental Studies & Impact Assessment',
          desc: 'Analyzing environmental impacts of projects to ensure compliance with environmental regulations.',
          sub: ['Environmental Impact Assessment', 'Industrial Permits', 'Environmental Protection']
        }
      ]
    },
    clients: {
      tag: '03 / Success Partners',
      title: 'Proud of the trust of elite clients and partners',
      sectors: {
        gov: 'Government & Semi-Government',
        corp: 'Publicly Listed Companies',
        fin: 'Financial & Real Estate Sector',
        misc: 'Various Sector Projects'
      }
    },
    projects: {
      tag: '04 / Our Projects',
      title: 'Similar Scope Projects',
      items: [
        { client: 'Al Khuraif Company', title: 'Centro Rotana Hotel - Hail', desc: 'A modern hospitality project in Hail featuring a contemporary design suited for business travelers and families.', tags: ['Design', 'Supervision'], image: '/projects/hotel.jpg' },
        { client: 'Qalaed Company', title: 'Qalaed Tower - Riyadh', desc: 'A modern office tower on King Salman Road offering flexible workspaces with high quality standards.', tags: ['Supervision'], image: '/projects/tower.jpg' },
        { client: 'Al Khuraif Company', title: 'Al Mihwar Project - Al Rimal', desc: 'A commercial complex in Al Rimal district, Riyadh, within the commercial hub of the area.', tags: ['Design', 'Supervision'], image: '/projects/mall.jpg' },
        { client: 'ZATCA', title: 'Zakat, Tax & Customs Authority', desc: 'Review of survey works and verification and updating of survey points for all land ports.', tags: ['Surveying'], image: '/projects/border.jpg' },
        { client: 'SPARK', title: 'King Salman Energy Park', desc: 'Inspection and assessment of power stations, transmission lines, and infrastructure.', tags: ['Consulting'], image: '/projects/energy.jpg' },
        { client: 'NEOM', title: 'NEOM', desc: 'Spatial and real estate study for expropriation purposes.', tags: ['Surveying', 'Real Estate'], image: '/projects/neom.jpg' }
      ]
    },
    contact: {
      tag: '05 / Contact Us',
      title: 'Start Your Project With Us',
      subtitle: 'We are here to help you achieve your vision. Contact our team for a personalized consultation.',
      whatsapp: 'Contact Us via WhatsApp',

      location: 'Riyadh, Saudi Arabia'
    },
    footer: {
      name: 'Dar Al Qiyas for Professional Consulting',
      rights: 'All rights reserved.',
      builtBy: 'Designed and Built by'
    }
  }
};

interface LanguageContextType {
  language: Language;
  t: (key: string) => any;
  toggleLanguage: () => void;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (path: string) => {
    const keys = path.split('.');
    let result = translations[language];
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path;
      }
    }
    return result;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
