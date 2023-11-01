public static class PermissionDefinitions
{
    public static class AdminPermissions
    {
        public const string ManageUsers = "Admin.ManageUsers";
        public const string ManageSettings = "Admin.ManageSettings";
    }

    public static class CustomerPermissions
    {
        public const string Delete = "Customer.Delete";
        public const string Update = "Customer.Update";
        public const string Read = "Customer.Read";
        public const string Create = "Customer.Create";
    }
}
