export interface Translations {
  // Common
  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    view: string;
    add: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    filter: string;
    all: string;
    none: string;
    yes: string;
    no: string;
    confirm: string;
    close: string;
    submit: string;
    reset: string;
    update: string;
    create: string;
    remove: string;
    select: string;
    choose: string;
    required: string;
    optional: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };

  // Navigation
  navigation: {
    dashboard: string;
    fabrics: string;
    projects: string;
    profile: string;
    admin: string;
    logout: string;
    login: string;
    signup: string;
  };

  // Authentication
  auth: {
    login: string;
    logout: string;
    signup: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    resetPassword: string;
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    emailOrUsername: string;
    welcomeBack: string;
    createAccount: string;
    dontHaveAccount: string;
    alreadyHaveAccount: string;
    signingIn: string;
    creatingAccount: string;
    signIn: string;
    signUp: string;
    passwordRequirements: string;
    passwordMinLength: string;
    passwordsDoNotMatch: string;
    invalidCredentials: string;
    accountSuspended: string;
    accountPending: string;
    loginSuccessful: string;
    logoutSuccessful: string;
    passwordChanged: string;
    accountCreated: string;
    accountPendingApproval: string;
    signupsDisabled: string;
  };

  // Dashboard
  dashboard: {
    title: string;
    welcome: string;
    myFabrics: string;
    searchFabrics: string;
    allTypes: string;
    pinnedFabrics: string;
    allFabrics: string;
    noFabrics: string;
    noFabricsDescription: string;
    addFabric: string;
    useFabric: string;
    yardsLeft: string;
    noImage: string;
  };

  // Fabrics
  fabrics: {
    fabric: string;
    fabrics: string;
    addFabric: string;
    editFabric: string;
    deleteFabric: string;
    fabricName: string;
    fabricType: string;
    fabricColor: string;
    yardsTotal: string;
    yardsLeft: string;
    cost: string;
    notes: string;
    image: string;
    uploadImage: string;
    removeImage: string;
    pinFabric: string;
    unpinFabric: string;
    recordUsage: string;
    yardsUsed: string;
    projectName: string;
    usageNotes: string;
    usageHistory: string;
    noUsageHistory: string;
    fabricTypes: {
      cotton: string;
      linen: string;
      silk: string;
      wool: string;
      polyester: string;
      denim: string;
      fleece: string;
      knit: string;
    };
  };

  // Projects
  projects: {
    project: string;
    projects: string;
    myProjects: string;
    addProject: string;
    editProject: string;
    deleteProject: string;
    projectName: string;
    description: string;
    status: string;
    targetDate: string;
    notes: string;
    materials: string;
    addMaterial: string;
    removeMaterial: string;
    yardsNeeded: string;
    materialNotes: string;
    noProjects: string;
    noProjectsDescription: string;
    createFirstProject: string;
    noProjectsFound: string;
    adjustSearchFilter: string;
    projectStatus: {
      planning: string;
      inProgress: string;
      completed: string;
      onHold: string;
    };
  };

  // User Profile
  profile: {
    title: string;
    accountInformation: string;
    memberSince: string;
    emailVerified: string;
    accountStatus: string;
    lastLogin: string;
    yourActivity: string;
    fabrics: string;
    projects: string;
    usageRecords: string;
    quickActions: string;
    backToDashboard: string;
    adminDashboard: string;
    changePassword: string;
    updatePassword: string;
    passwordRequirements: string;
    currentPasswordRequired: string;
    newPasswordRequired: string;
    confirmPasswordRequired: string;
    passwordsDoNotMatch: string;
    passwordChanged: string;
    passwordChangeError: string;
  };

  // Admin
  admin: {
    title: string;
    userManagement: string;
    settings: string;
    totalUsers: string;
    pendingApproval: string;
    activeUsers: string;
    suspended: string;
    approveUser: string;
    suspendUser: string;
    activateUser: string;
    deleteUser: string;
    resetPassword: string;
    allowSignups: string;
    requireApproval: string;
    signupsEnabled: string;
    signupsDisabled: string;
    approvalRequired: string;
    autoApproval: string;
    applicationSettings: string;
    userStats: string;
    fabrics: string;
    projects: string;
    lastLogin: string;
    joined: string;
    resetPasswordFor: string;
    newPassword: string;
    userOverview: string;
    pendingUsers: string;
    allUsers: string;
  };

  // Status
  status: {
    active: string;
    pending: string;
    suspended: string;
    planning: string;
    inProgress: string;
    completed: string;
    onHold: string;
  };

  // Messages
  messages: {
    confirmDelete: string;
    confirmDeleteFabric: string;
    confirmDeleteProject: string;
    deleteWarning: string;
    operationSuccessful: string;
    operationFailed: string;
    pleaseTryAgain: string;
    changesSaved: string;
    changesNotSaved: string;
    unsavedChanges: string;
    leaveWithoutSaving: string;
  };

  // Language
  language: {
    english: string;
    spanish: string;
    language: string;
    changeLanguage: string;
    languageChanged: string;
  };
}

export const translations: Record<string, Translations> = {
  en: {
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      add: "Add",
      back: "Back",
      next: "Next",
      previous: "Previous",
      search: "Search",
      filter: "Filter",
      all: "All",
      none: "None",
      yes: "Yes",
      no: "No",
      confirm: "Confirm",
      close: "Close",
      submit: "Submit",
      reset: "Reset",
      update: "Update",
      create: "Create",
      remove: "Remove",
      select: "Select",
      choose: "Choose",
      required: "Required",
      optional: "Optional",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Information",
    },
    navigation: {
      dashboard: "Dashboard",
      fabrics: "Fabrics",
      projects: "Projects",
      profile: "Profile",
      admin: "Admin",
      logout: "Logout",
      login: "Login",
      signup: "Sign Up",
    },
    auth: {
      login: "Login",
      logout: "Logout",
      signup: "Sign Up",
      email: "Email",
      username: "Username",
      password: "Password",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot Password",
      resetPassword: "Reset Password",
      changePassword: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      emailOrUsername: "Email or Username",
      welcomeBack: "Welcome Back",
      createAccount: "Create Account",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      signingIn: "Signing In...",
      creatingAccount: "Creating Account...",
      signIn: "Sign In",
      signUp: "Sign Up",
      passwordRequirements: "Password Requirements",
      passwordMinLength: "Must be at least 6 characters long",
      passwordsDoNotMatch: "Passwords do not match",
      invalidCredentials: "Invalid email/username or password",
      accountSuspended: "Account has been suspended. Please contact admin.",
      accountPending: "Account is pending approval. Please wait for admin approval.",
      loginSuccessful: "Login successful",
      logoutSuccessful: "Logout successful",
      passwordChanged: "Password changed successfully",
      accountCreated: "Account created successfully! You can now log in.",
      accountPendingApproval: "Account created successfully! Please wait for admin approval.",
      signupsDisabled: "Signups are currently disabled",
    },
    dashboard: {
      title: "My Fabrics",
      welcome: "Welcome",
      myFabrics: "My Fabrics",
      searchFabrics: "Search fabrics by name, type, or color...",
      allTypes: "All Types",
      pinnedFabrics: "Pinned Fabrics",
      allFabrics: "All Fabrics",
      noFabrics: "No fabrics yet",
      noFabricsDescription: "Start by adding your first fabric to your collection!",
      addFabric: "Add Fabric",
      useFabric: "Use Fabric",
      yardsLeft: "yards left",
      noImage: "No image",
    },
    fabrics: {
      fabric: "Fabric",
      fabrics: "Fabrics",
      addFabric: "Add Fabric",
      editFabric: "Edit Fabric",
      deleteFabric: "Delete Fabric",
      fabricName: "Fabric Name",
      fabricType: "Fabric Type",
      fabricColor: "Color",
      yardsTotal: "Total Yards",
      yardsLeft: "Yards Left",
      cost: "Cost",
      notes: "Notes",
      image: "Image",
      uploadImage: "Upload Image",
      removeImage: "Remove Image",
      pinFabric: "Pin Fabric",
      unpinFabric: "Unpin Fabric",
      recordUsage: "Record Usage",
      yardsUsed: "Yards Used",
      projectName: "Project Name",
      usageNotes: "Usage Notes",
      usageHistory: "Usage History",
      noUsageHistory: "No usage history",
      fabricTypes: {
        cotton: "Cotton",
        linen: "Linen",
        silk: "Silk",
        wool: "Wool",
        polyester: "Polyester",
        denim: "Denim",
        fleece: "Fleece",
        knit: "Knit",
      },
    },
    projects: {
      project: "Project",
      projects: "Projects",
      myProjects: "My Projects",
      addProject: "Add Project",
      editProject: "Edit Project",
      deleteProject: "Delete Project",
      projectName: "Project Name",
      description: "Description",
      status: "Status",
      targetDate: "Target Date",
      notes: "Notes",
      materials: "Materials",
      addMaterial: "Add Material",
      removeMaterial: "Remove Material",
      yardsNeeded: "Yards Needed",
      materialNotes: "Material Notes",
      noProjects: "No projects yet",
      noProjectsDescription: "Start by creating your first sewing project!",
      createFirstProject: "Create Your First Project",
      noProjectsFound: "No projects found",
      adjustSearchFilter: "Try adjusting your search or filter criteria",
      projectStatus: {
        planning: "Planning",
        inProgress: "In Progress",
        completed: "Completed",
        onHold: "On Hold",
      },
    },
    profile: {
      title: "User Profile",
      accountInformation: "Account Information",
      memberSince: "Member Since",
      emailVerified: "Email Verified",
      accountStatus: "Account Status",
      lastLogin: "Last Login",
      yourActivity: "Your Activity",
      fabrics: "Fabrics",
      projects: "Projects",
      usageRecords: "Usage Records",
      quickActions: "Quick Actions",
      backToDashboard: "Back to Dashboard",
      adminDashboard: "Admin Dashboard",
      changePassword: "Change Password",
      updatePassword: "Update Password",
      passwordRequirements: "Password Requirements",
      currentPasswordRequired: "Current password is required",
      newPasswordRequired: "New password is required",
      confirmPasswordRequired: "Password confirmation is required",
      passwordsDoNotMatch: "New passwords do not match",
      passwordChanged: "Password changed successfully",
      passwordChangeError: "Failed to change password",
    },
    admin: {
      title: "Admin Dashboard",
      userManagement: "User Management",
      settings: "Settings",
      totalUsers: "Total Users",
      pendingApproval: "Pending Approval",
      activeUsers: "Active Users",
      suspended: "Suspended",
      approveUser: "Approve",
      suspendUser: "Suspend",
      activateUser: "Activate",
      deleteUser: "Delete",
      resetPassword: "Reset Password",
      allowSignups: "Allow Signups",
      requireApproval: "Require Approval",
      signupsEnabled: "New users can create accounts",
      signupsDisabled: "New user registration is disabled",
      approvalRequired: "New accounts require admin approval",
      autoApproval: "New accounts are automatically activated",
      applicationSettings: "Application Settings",
      userStats: "User Statistics",
      fabrics: "Fabrics",
      projects: "Projects",
      lastLogin: "Last Login",
      joined: "Joined",
      resetPasswordFor: "Reset Password for",
      newPassword: "New Password",
      userOverview: "User Overview",
      pendingUsers: "Pending Users",
      allUsers: "All Users",
    },
    status: {
      active: "Active",
      pending: "Pending",
      suspended: "Suspended",
      planning: "Planning",
      inProgress: "In Progress",
      completed: "Completed",
      onHold: "On Hold",
    },
    messages: {
      confirmDelete: "Are you sure you want to delete this item?",
      confirmDeleteFabric: "Are you sure you want to delete this fabric?",
      confirmDeleteProject: "Are you sure you want to delete this project?",
      deleteWarning: "This action cannot be undone.",
      operationSuccessful: "Operation completed successfully",
      operationFailed: "Operation failed",
      pleaseTryAgain: "Please try again",
      changesSaved: "Changes saved successfully",
      changesNotSaved: "Changes not saved",
      unsavedChanges: "You have unsaved changes",
      leaveWithoutSaving: "Leave without saving?",
    },
    language: {
      english: "English",
      spanish: "Español",
      language: "Language",
      changeLanguage: "Change Language",
      languageChanged: "Language changed successfully",
    },
  },
  es: {
    common: {
      loading: "Cargando...",
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      view: "Ver",
      add: "Agregar",
      back: "Atrás",
      next: "Siguiente",
      previous: "Anterior",
      search: "Buscar",
      filter: "Filtrar",
      all: "Todos",
      none: "Ninguno",
      yes: "Sí",
      no: "No",
      confirm: "Confirmar",
      close: "Cerrar",
      submit: "Enviar",
      reset: "Restablecer",
      update: "Actualizar",
      create: "Crear",
      remove: "Quitar",
      select: "Seleccionar",
      choose: "Elegir",
      required: "Requerido",
      optional: "Opcional",
      error: "Error",
      success: "Éxito",
      warning: "Advertencia",
      info: "Información",
    },
    navigation: {
      dashboard: "Panel",
      fabrics: "Telas",
      projects: "Proyectos",
      profile: "Perfil",
      admin: "Administrador",
      logout: "Cerrar Sesión",
      login: "Iniciar Sesión",
      signup: "Registrarse",
    },
    auth: {
      login: "Iniciar Sesión",
      logout: "Cerrar Sesión",
      signup: "Registrarse",
      email: "Correo Electrónico",
      username: "Nombre de Usuario",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      forgotPassword: "Olvidé mi Contraseña",
      resetPassword: "Restablecer Contraseña",
      changePassword: "Cambiar Contraseña",
      currentPassword: "Contraseña Actual",
      newPassword: "Nueva Contraseña",
      emailOrUsername: "Correo o Nombre de Usuario",
      welcomeBack: "Bienvenido de Vuelta",
      createAccount: "Crear Cuenta",
      dontHaveAccount: "¿No tienes una cuenta?",
      alreadyHaveAccount: "¿Ya tienes una cuenta?",
      signingIn: "Iniciando Sesión...",
      creatingAccount: "Creando Cuenta...",
      signIn: "Iniciar Sesión",
      signUp: "Registrarse",
      passwordRequirements: "Requisitos de Contraseña",
      passwordMinLength: "Debe tener al menos 6 caracteres",
      passwordsDoNotMatch: "Las contraseñas no coinciden",
      invalidCredentials: "Correo/nombre de usuario o contraseña inválidos",
      accountSuspended: "La cuenta ha sido suspendida. Contacta al administrador.",
      accountPending: "La cuenta está pendiente de aprobación. Espera la aprobación del administrador.",
      loginSuccessful: "Inicio de sesión exitoso",
      logoutSuccessful: "Cierre de sesión exitoso",
      passwordChanged: "Contraseña cambiada exitosamente",
      accountCreated: "¡Cuenta creada exitosamente! Ya puedes iniciar sesión.",
      accountPendingApproval: "¡Cuenta creada exitosamente! Espera la aprobación del administrador.",
      signupsDisabled: "Los registros están deshabilitados actualmente",
    },
    dashboard: {
      title: "Mis Telas",
      welcome: "Bienvenido",
      myFabrics: "Mis Telas",
      searchFabrics: "Buscar telas por nombre, tipo o color...",
      allTypes: "Todos los Tipos",
      pinnedFabrics: "Telas Fijadas",
      allFabrics: "Todas las Telas",
      noFabrics: "Aún no hay telas",
      noFabricsDescription: "¡Comienza agregando tu primera tela a tu colección!",
      addFabric: "Agregar Tela",
      useFabric: "Usar Tela",
      yardsLeft: "yardas restantes",
      noImage: "Sin imagen",
    },
    fabrics: {
      fabric: "Tela",
      fabrics: "Telas",
      addFabric: "Agregar Tela",
      editFabric: "Editar Tela",
      deleteFabric: "Eliminar Tela",
      fabricName: "Nombre de la Tela",
      fabricType: "Tipo de Tela",
      fabricColor: "Color",
      yardsTotal: "Yardas Totales",
      yardsLeft: "Yardas Restantes",
      cost: "Costo",
      notes: "Notas",
      image: "Imagen",
      uploadImage: "Subir Imagen",
      removeImage: "Quitar Imagen",
      pinFabric: "Fijar Tela",
      unpinFabric: "Desfijar Tela",
      recordUsage: "Registrar Uso",
      yardsUsed: "Yardas Usadas",
      projectName: "Nombre del Proyecto",
      usageNotes: "Notas de Uso",
      usageHistory: "Historial de Uso",
      noUsageHistory: "Sin historial de uso",
      fabricTypes: {
        cotton: "Algodón",
        linen: "Lino",
        silk: "Seda",
        wool: "Lana",
        polyester: "Poliéster",
        denim: "Denim",
        fleece: "Polar",
        knit: "Tejido",
      },
    },
    projects: {
      project: "Proyecto",
      projects: "Proyectos",
      myProjects: "Mis Proyectos",
      addProject: "Agregar Proyecto",
      editProject: "Editar Proyecto",
      deleteProject: "Eliminar Proyecto",
      projectName: "Nombre del Proyecto",
      description: "Descripción",
      status: "Estado",
      targetDate: "Fecha Objetivo",
      notes: "Notas",
      materials: "Materiales",
      addMaterial: "Agregar Material",
      removeMaterial: "Quitar Material",
      yardsNeeded: "Yardas Necesarias",
      materialNotes: "Notas del Material",
      noProjects: "Aún no hay proyectos",
      noProjectsDescription: "¡Comienza creando tu primer proyecto de costura!",
      createFirstProject: "Crear tu Primer Proyecto",
      noProjectsFound: "No se encontraron proyectos",
      adjustSearchFilter: "Intenta ajustar tu búsqueda o criterios de filtro",
      projectStatus: {
        planning: "Planificación",
        inProgress: "En Progreso",
        completed: "Completado",
        onHold: "En Pausa",
      },
    },
    profile: {
      title: "Perfil de Usuario",
      accountInformation: "Información de la Cuenta",
      memberSince: "Miembro Desde",
      emailVerified: "Correo Verificado",
      accountStatus: "Estado de la Cuenta",
      lastLogin: "Último Inicio de Sesión",
      yourActivity: "Tu Actividad",
      fabrics: "Telas",
      projects: "Proyectos",
      usageRecords: "Registros de Uso",
      quickActions: "Acciones Rápidas",
      backToDashboard: "Volver al Panel",
      adminDashboard: "Panel de Administrador",
      changePassword: "Cambiar Contraseña",
      updatePassword: "Actualizar Contraseña",
      passwordRequirements: "Requisitos de Contraseña",
      currentPasswordRequired: "La contraseña actual es requerida",
      newPasswordRequired: "La nueva contraseña es requerida",
      confirmPasswordRequired: "La confirmación de contraseña es requerida",
      passwordsDoNotMatch: "Las nuevas contraseñas no coinciden",
      passwordChanged: "Contraseña cambiada exitosamente",
      passwordChangeError: "Error al cambiar la contraseña",
    },
    admin: {
      title: "Panel de Administrador",
      userManagement: "Gestión de Usuarios",
      settings: "Configuración",
      totalUsers: "Total de Usuarios",
      pendingApproval: "Pendiente de Aprobación",
      activeUsers: "Usuarios Activos",
      suspended: "Suspendidos",
      approveUser: "Aprobar",
      suspendUser: "Suspender",
      activateUser: "Activar",
      deleteUser: "Eliminar",
      resetPassword: "Restablecer Contraseña",
      allowSignups: "Permitir Registros",
      requireApproval: "Requerir Aprobación",
      signupsEnabled: "Los nuevos usuarios pueden crear cuentas",
      signupsDisabled: "El registro de nuevos usuarios está deshabilitado",
      approvalRequired: "Las nuevas cuentas requieren aprobación del administrador",
      autoApproval: "Las nuevas cuentas se activan automáticamente",
      applicationSettings: "Configuración de la Aplicación",
      userStats: "Estadísticas de Usuario",
      fabrics: "Telas",
      projects: "Proyectos",
      lastLogin: "Último Inicio de Sesión",
      joined: "Se Unió",
      resetPasswordFor: "Restablecer Contraseña para",
      newPassword: "Nueva Contraseña",
      userOverview: "Resumen de Usuarios",
      pendingUsers: "Usuarios Pendientes",
      allUsers: "Todos los Usuarios",
    },
    status: {
      active: "Activo",
      pending: "Pendiente",
      suspended: "Suspendido",
      planning: "Planificación",
      inProgress: "En Progreso",
      completed: "Completado",
      onHold: "En Pausa",
    },
    messages: {
      confirmDelete: "¿Estás seguro de que quieres eliminar este elemento?",
      confirmDeleteFabric: "¿Estás seguro de que quieres eliminar esta tela?",
      confirmDeleteProject: "¿Estás seguro de que quieres eliminar este proyecto?",
      deleteWarning: "Esta acción no se puede deshacer.",
      operationSuccessful: "Operación completada exitosamente",
      operationFailed: "La operación falló",
      pleaseTryAgain: "Por favor intenta de nuevo",
      changesSaved: "Cambios guardados exitosamente",
      changesNotSaved: "Cambios no guardados",
      unsavedChanges: "Tienes cambios sin guardar",
      leaveWithoutSaving: "¿Salir sin guardar?",
    },
    language: {
      english: "English",
      spanish: "Español",
      language: "Idioma",
      changeLanguage: "Cambiar Idioma",
      languageChanged: "Idioma cambiado exitosamente",
    },
  },
};
