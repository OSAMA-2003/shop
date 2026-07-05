import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        collection: 'Collection',
        mockups: 'Mockups',
        contact: 'Contact',
        login: 'Login',
        profile: 'Profile',
        cart: 'Cart',
        logout: 'Logout'
      },
      hero: {
        ignite: 'Ignite',
        creative: 'Creative',
        flow: 'Flow',
        subtext: 'High-impact silhouettes engineered for the concrete jungle. Uncompromising quality meets brutalist minimal design.',
        explore: 'Explore Mockups',
        view: 'View Collections'
      },
      features: {
        title: 'Why Choose Us',
        f1_title: 'Fast Shipping',
        f1_desc: 'On orders in Egypt',
        f2_title: 'Product Warranty',
        f2_desc: 'Free Returns or Exchanges within 14 Days',
        f3_title: 'Easy Returns',
        f3_desc: 'Simple and Fast Process in Minutes',
        f4_title: '24/7 Support',
        f4_desc: 'Our Team Is Ready to Assist You Anytime'
      },
      collection: {
        title: 'The',
        accentTitle: 'Collection',
        subtitle: 'Explore our premium raw canvases and custom apparel',
        noProducts: 'No Products Found',
        comingSoon: 'Check back later for new arrivals.',
        price: 'Price',
        view: 'View'
      },
      product: {
        price: 'Price',
        descriptionFallback: '450 GSM heavyweight organic cotton fabric. Structured oversized fit with dropped shoulders and thick ribbed collar. Raw edge hem detail. Made in Portugal.',
        sizes: 'Sizes',
        addToCart: 'Add to cart',
        adding: 'Adding...',
        materialsCare: 'Materials & Care',
        productNotFound: 'Product not found',
        zoomBadge: 'Hover to zoom'
      },
      cart: {
        title: 'Your Cart',
        empty: 'Your cart is empty',
        shopNow: 'Shop Now',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        tax: 'Tax',
        total: 'Total',
        checkout: 'Proceed to Checkout',
        remove: 'Remove',
        sizeLabel: 'Size',
        customMockup: 'Custom Mockup',
        colorLabel: 'Color'
      },
      checkout: {
        title: 'Billing Details',
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        city: 'City / State',
        address: 'Full Street Address',
        paymentMethod: 'Payment Method',
        instapayInfo: 'Transfer to Instapay address:',
        screenshotLabel: 'Upload Payment Screenshot *',
        placeOrder: 'Place Order',
        placing: 'Placing Order...',
        instapayPlaceholder: 'kyandr@instapay'
      },
      contact: {
        title: 'Contact',
        accentTitle: 'Us',
        subtitle: 'Drop us a line. We typically respond within 24 hours.',
        addressLabel: 'Address',
        addressVal: 'Imagination Street, Future City 123',
        phoneLabel: 'Phone',
        phoneVal: '+123 456 7890',
        emailLabel: 'Email',
        emailVal: 'support@kyandr.com',
        whatsappLabel: 'Whatsapp',
        whatsappVal: '0102931414',
        nameField: 'Name *',
        namePlaceholder: 'ENTER YOUR NAME',
        emailField: 'Email *',
        emailPlaceholder: 'YOU@EXAMPLE.COM',
        messageField: 'Message *',
        messagePlaceholder: 'HOW CAN WE HELP?',
        sendBtn: 'Send Message',
        sendingBtn: 'Sending...'
      },
      footer: {
        brandTagline: 'Not just clothes, it’s your vibe. Stay bold, stay Kyandr.',
        newsletterTitle: 'Newsletter',
        newsletterSubtitle: 'Join the underground. Get 10% off your first drop.',
        emailPlaceholder: 'YOU@EXAMPLE.COM',
        navigationTitle: 'Navigation',
        collectionsTitle: 'Collections',
        urbanApparel: 'Urban Apparel',
        streetwearTees: 'Streetwear Tees',
        premiumHoodies: 'Premium Hoodies',
        accessories: 'Accessories',
        copyright: 'All rights reserved.'
      },
      profile: {
        title: 'Your Profile',
        email: 'Email',
        logout: 'Log Out',
        ordersTitle: 'My Orders',
        noOrders: 'No orders placed yet.',
        viewBtn: 'View Details',
        trackBtn: 'Track'
      },
      mockups: {
        title: 'Design Your Own Product',
        subtitle: 'Bring your designs to life! Choose a product mockup and customize it with your own graphics, text, and colors.',
        comingSoon: 'The lab is currently cooking up new canvases. Stay tuned.',
        viewAll: 'View All Mockups',
        customizeBtn: 'Customize',
        comingSoonTitle: 'Mockups Coming Soon'
      },
      auth: {
        loginHeader: 'Log In',
        signupHeader: 'Sign Up',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        fullName: 'Full Name',
        enterBtn: 'Enter',
        entering: 'Entering...',
        createBtn: 'Create',
        creating: 'Creating...',
        or: 'or',
        googleAuth: 'Google Auth',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        signupLink: 'Sign up',
        loginLink: 'Log in',
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email address',
        passwordRequired: 'Password is required',
        passwordMin: 'Password must be at least 8 characters',
        fullNameRequired: 'Full name is required',
        confirmPasswordRequired: 'Please confirm your password',
        passwordsMismatch: 'Passwords do not match',
        pleaseLogin: 'Please log in first to continue!',
        loginSuccess: 'Logged in successfully!',
        googleSuccess: 'Logged in with Google successfully!',
        googleSignupSuccess: 'Account created and logged in with Google successfully!',
        googleFail: 'Google Sign-In failed. Please try again.',
        userNotFound: "User doesn't exist",
        incorrectPassword: "Incorrect password"
      }
    }
  },
  ar: {
    translation: {
      nav: {
        home: 'الرئيسية',
        collection: 'المجموعة',
        mockups: 'النماذج المخصصة',
        contact: 'اتصل بنا',
        login: 'تسجيل الدخول',
        profile: 'الحساب',
        cart: 'السلة',
        logout: 'خروج'
      },
      hero: {
        ignite: 'أشعل',
        creative: 'التدفق',
        flow: 'الإبداعي',
        subtext: 'تصاميم قوية صممت لنمط الحياة العصري. جودة لا تضاهى تلتقي بجماليات البساطة والجرأة.',
        explore: 'استكشف النماذج',
        view: 'عرض المجموعات'
      },
      features: {
        title: 'لماذا تختارنا',
        f1_title: 'شحن سريع',
        f1_desc: 'على جميع الطلبات داخل مصر',
        f2_title: 'ضمان المنتج',
        f2_desc: 'استرجاع أو استبدال مجاني خلال 14 يومًا',
        f3_title: 'استرجاع سهل',
        f3_desc: 'عملية بسيطة وسريعة في دقائق معدودة',
        f4_title: 'دعم على مدار الساعة',
        f4_desc: 'فريقنا متواجد ومستعد لمساعدتك في أي وقت'
      },
      collection: {
        title: 'المعروضات',
        accentTitle: 'الحالية',
        subtitle: 'استكشف التشكيلة الحصرية من الملابس الخام الممتازة.',
        noProducts: 'لم يتم العثور على منتجات',
        comingSoon: 'ترقبوا تشكيلتنا الجديدة قريبًا.',
        price: 'السعر',
        view: 'عرض المنتج'
      },
      product: {
        price: 'السعر',
        descriptionFallback: 'نسيج قطني عضوي ثقيل بوزن 450 جرام. قصة فضفاضة مريحة مع أكتاف منسدلة وياقة سميكة مضلعة. تفاصيل خياطة خام ممتازة. صنع في البرتغال.',
        sizes: 'المقاسات المتاحة',
        addToCart: 'إضافة إلى السلة',
        adding: 'جاري الإضافة...',
        materialsCare: 'المواد والعناية بها',
        productNotFound: 'عذرًا، لم يتم العثور على هذا المنتج',
        zoomBadge: 'مرر الماوس للتكبير'
      },
      cart: {
        title: 'سلة المشتريات',
        empty: 'سلتك فارغة حاليًا',
        shopNow: 'تسوق الآن',
        subtotal: 'المجموع الفرعي',
        shipping: 'تكلفة الشحن',
        tax: 'الضريبة المضافة',
        total: 'المجموع الإجمالي',
        checkout: 'الذهاب لإتمام الدفع',
        remove: 'إلغاء',
        sizeLabel: 'المقاس',
        customMockup: 'نموذج مخصص',
        colorLabel: 'اللون'
      },
      checkout: {
        title: 'بيانات الفاتورة والشحن',
        name: 'الاسم بالكامل',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        city: 'المحافظة / المدينة',
        address: 'عنوان الشارع بالتفصيل',
        paymentMethod: 'طريقة الدفع',
        instapayInfo: 'برجاء التحويل إلى عنوان إنستاباي التالي:',
        screenshotLabel: 'تحميل لقطة شاشة لإثبات التحويل *',
        placeOrder: 'تأكيد الطلب',
        placing: 'جاري تأكيد طلبك...',
        instapayPlaceholder: 'kyandr@instapay'
      },
      contact: {
        title: 'تواصل',
        accentTitle: 'معنا',
        subtitle: 'راسلنا مباشرة. نقوم بالرد عادةً في غضون 24 ساعة.',
        addressLabel: 'العنوان',
        addressVal: 'شارع الخيال، المدينة المستقبلية 123',
        phoneLabel: 'الهاتف',
        phoneVal: '+123 456 7890',
        emailLabel: 'البريد الإلكتروني',
        emailVal: 'support@kyandr.com',
        whatsappLabel: 'واتساب',
        whatsappVal: '0102931414',
        nameField: 'الاسم *',
        namePlaceholder: 'أدخل اسمك بالكامل',
        emailField: 'البريد الإلكتروني *',
        emailPlaceholder: 'YOU@EXAMPLE.COM',
        messageField: 'الرسالة *',
        messagePlaceholder: 'كيف يمكننا مساعدتك؟',
        sendBtn: 'إرسال الرسالة',
        sendingBtn: 'جاري الإرسال...'
      },
      footer: {
        brandTagline: 'ليست مجرد ملابس، إنها تعبر عن هويتك. كن جريئًا، كن كياندر.',
        newsletterTitle: 'النشرة البريدية',
        newsletterSubtitle: 'انضم إلينا. احصل على خصم 10% على أول طلب لك.',
        emailPlaceholder: 'أدخل بريدك الإلكتروني',
        navigationTitle: 'التنقل في الموقع',
        collectionsTitle: 'المجموعات',
        urbanApparel: 'الملابس العصرية',
        streetwearTees: 'تيشيرتات كياندر',
        premiumHoodies: 'هوديز متميزة',
        accessories: 'الإكسسوارات',
        copyright: 'جميع الحقوق محفوظة.'
      },
      profile: {
        title: 'الملف الشخصي',
        email: 'البريد الإلكتروني',
        logout: 'تسجيل الخروج',
        ordersTitle: 'طلباتي السابقة',
        noOrders: 'لم تقم بأي طلبات بعد.',
        viewBtn: 'تفاصيل الطلب',
        trackBtn: 'تتبع الشحنة'
      },
      mockups: {
        title: 'صمم منتجك بنفسك',
        subtitle: 'جسّد أفكارك على أرض الواقع! اختر نموذجاً وقم بتخصيصه وتعديله بإضافة تصاميمك، نصوصك، وألوانك الخاصة.',
        comingSoon: 'المعمل يقوم حالياً بالتحضير لنماذج جديدة. تابعنا لجديدنا.',
        viewAll: 'عرض جميع النماذج',
        customizeBtn: 'تخصيص وتعديل',
        comingSoonTitle: 'النماذج قريباً'
      },
      auth: {
        loginHeader: 'تسجيل الدخول',
        signupHeader: ' حساب جديد',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        confirmPassword: 'تأكيد كلمة المرور',
        fullName: 'الاسم بالكامل',
        enterBtn: 'دخول',
        entering: 'جاري الدخول...',
        createBtn: 'إنشاء حساب',
        creating: 'جاري الإنشاء...',
        or: 'أو',
        googleAuth: 'التسجيل بواسطة جوجل',
        noAccount: 'ليس لديك حساب؟',
        hasAccount: 'لديك حساب بالفعل؟',
        signupLink: 'سجل الآن',
        loginLink: 'سجل دخولك',
        emailRequired: 'البريد الإلكتروني مطلوب',
        emailInvalid: 'البريد الإلكتروني غير صالح',
        passwordRequired: 'كلمة المرور مطلوبة',
        passwordMin: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل',
        fullNameRequired: 'الاسم بالكامل مطلوب',
        confirmPasswordRequired: 'يرجى تأكيد كلمة المرور',
        passwordsMismatch: 'كلمتا المرور غير متطابقتين',
        pleaseLogin: 'يرجى تسجيل الدخول أولاً للمتابعة!',
        loginSuccess: 'تم تسجيل الدخول بنجاح!',
        googleSuccess: 'تم تسجيل الدخول بواسطة جوجل بنجاح!',
        googleSignupSuccess: 'تم إنشاء الحساب وتسجيل الدخول بواسطة جوجل بنجاح!',
        googleFail: 'فشل تسجيل الدخول بواسطة جوجل. يرجى المحاولة مرة أخرى.',
        userNotFound: 'المستخدم غير موجود',
        incorrectPassword: 'كلمة المرور غير صحيحة'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage']
    }
  });

export default i18n;
