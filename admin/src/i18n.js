import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      sidebar: {
        dashboard: 'Dashboard',
        addProduct: 'Add Product',
        productList: 'Products List',
        addMockup: 'Add Mockup',
        mockupList: 'Mockups List',
        orders: 'Orders',
        users: 'Users',
        notifications: 'Notifications',
        logout: 'Log Out'
      },
      dashboard: {
        title: 'Dashboard Overview',
        totalSales: 'Total Sales',
        activeProducts: 'Active Products',
        totalOrders: 'Total Orders',
        customDesigns: 'Custom Designs',
        activeUsers: 'Active Users',
        recentOrders: 'Recent Orders',
        orderId: 'Order ID',
        customer: 'Customer',
        amount: 'Amount',
        status: 'Status',
        date: 'Date',
        egp: 'EGP'
      },
      add: {
        productTitle: 'Add New Product',
        mockupTitle: 'Add New Mockup',
        nameEn: 'Product Name (English) *',
        nameAr: 'Product Name (Arabic) *',
        descEn: 'Product Description (English) *',
        descAr: 'Product Description (Arabic) *',
        price: 'Price (EGP) *',
        sizes: 'Available Sizes',
        uploadImage: 'Upload Product Image *',
        uploadFront: 'Upload Front Image *',
        uploadBack: 'Upload Back Image *',
        submit: 'Add Item',
        submitting: 'Adding Item...',
        nameEnPlaceholder: 'Enter name in English',
        nameArPlaceholder: 'Enter name in Arabic',
        descEnPlaceholder: 'Enter description in English',
        descArPlaceholder: 'Enter description in Arabic',
        pricePlaceholder: 'Price in EGP'
      },
      list: {
        productHeader: 'Product Catalog List',
        mockupHeader: 'Mockup Canvas List',
        image: 'Image',
        nameEn: 'Name (EN)',
        nameAr: 'Name (AR)',
        price: 'Price',
        action: 'Action',
        remove: 'Remove',
        noItems: 'No items found.'
      },
      orders: {
        header: 'Order Administration',
        items: 'Items',
        payment: 'Payment Proof',
        address: 'Delivery Address',
        phone: 'Phone',
        city: 'City',
        street: 'Street',
        status: 'Order Status',
        pending: 'Pending',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
        updateSuccess: 'Order status updated!',
        viewProof: 'View Receipt',
        acceptBtn: 'Accept Order',
        rejectBtn: 'Reject Order'
      },
      users: {
        header: 'User Accounts Directory',
        name: 'Name',
        email: 'Email',
        date: 'Registered Date',
        role: 'Role'
      },
      notifications: {
        header: 'System Notifications Logs',
        message: 'Notification Message',
        time: 'Logged Time',
        type: 'Type',
        noLogs: 'No notification logs recorded.'
      },
      login: {
        header: 'Admin Portal Login',
        email: 'Admin Email',
        password: 'Security Password',
        btn: 'Access Dashboard',
        processing: 'Logging in...'
      }
    }
  },
  ar: {
    translation: {
      sidebar: {
        dashboard: 'لوحة التحكم',
        addProduct: 'إضافة منتج',
        productList: 'قائمة المنتجات',
        addMockup: 'إضافة نموذج مخصص',
        mockupList: 'قائمة النماذج مخصصة',
        orders: 'إدارة الطلبات',
        users: 'إدارة المستخدمين',
        notifications: 'الإشعارات السجلية',
        logout: 'تسجيل الخروج'
      },
      dashboard: {
        title: 'نظرة عامة على لوحة التحكم',
        totalSales: 'إجمالي المبيعات',
        activeProducts: 'المنتجات النشطة',
        totalOrders: 'إجمالي الطلبات',
        customDesigns: 'التصاميم المصممة',
        activeUsers: 'المستخدمون النشطون',
        recentOrders: 'أحدث الطلبات المستلمة',
        orderId: 'رقم الطلب',
        customer: 'العميل',
        amount: 'القيمة',
        status: 'الحالة',
        date: 'التاريخ',
        egp: 'جنيه'
      },
      add: {
        productTitle: 'إضافة منتج جديد للمتجر',
        mockupTitle: 'إضافة نموذج ملابس جديد للتخصيص',
        nameEn: 'اسم المنتج بالإنجليزية *',
        nameAr: 'اسم المنتج بالعربية *',
        descEn: 'وصف المنتج بالإنجليزية *',
        descAr: 'وصف المنتج بالعربية *',
        price: 'السعر (جنيه مصري) *',
        sizes: 'المقاسات المتاحة',
        uploadImage: 'تحميل صورة المنتج الأساسية *',
        uploadFront: 'تحميل الصورة الأمامية *',
        uploadBack: 'تحميل الصورة الخلفية *',
        submit: 'إضافة للمتجر',
        submitting: 'جاري إضافة العنصر...',
        nameEnPlaceholder: 'أدخل الاسم باللغة الإنجليزية',
        nameArPlaceholder: 'أدخل الاسم باللغة العربية',
        descEnPlaceholder: 'أدخل الوصف باللغة الإنجليزية',
        descArPlaceholder: 'أدخل الوصف باللغة العربية',
        pricePlaceholder: 'السعر بالجنيه المصري'
      },
      list: {
        productHeader: 'قائمة كتالوج المنتجات',
        mockupHeader: 'قائمة نماذج الملابس للتخصيص',
        image: 'الصورة',
        nameEn: 'الاسم (EN)',
        nameAr: 'الاسم (AR)',
        price: 'السعر',
        action: 'الإجراء',
        remove: 'حذف',
        noItems: 'لم يتم العثور على أي عناصر.'
      },
      orders: {
        header: 'إدارة طلبات العملاء',
        items: 'المنتجات المطلوبة',
        payment: 'إثبات التحويل',
        address: 'عنوان التوصيل',
        phone: 'الهاتف',
        city: 'المدينة',
        street: 'الشارع بالتفصيل',
        status: 'حالة الطلب',
        pending: 'قيد المراجعة',
        shipped: 'تم الشحن',
        delivered: 'تم التوصيل',
        cancelled: 'تم الإلغاء',
        updateSuccess: 'تم تحديث حالة الطلب بنجاح!',
        viewProof: 'عرض الإيصال',
        acceptBtn: 'قبول الطلب',
        rejectBtn: 'رفض الطلب'
      },
      users: {
        header: 'سجل حسابات المستخدمين والعملاء',
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        date: 'تاريخ التسجيل',
        role: 'الصلاحية'
      },
      notifications: {
        header: 'سجلات الإشعارات والعمليات في النظام',
        message: 'رسالة الإشعار',
        time: 'وقت التسجيل',
        type: 'النوع',
        noLogs: 'لا توجد إشعارات مسجلة حاليًا.'
      },
      login: {
        header: 'تسجيل دخول لوحة المسؤول',
        email: 'البريد الإلكتروني للمسؤول',
        password: 'كلمة المرور السرية',
        btn: 'دخول لوحة التحكم',
        processing: 'جاري التحقق والدخول...'
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
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage']
    }
  });

export default i18n;
