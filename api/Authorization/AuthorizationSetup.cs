using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NetCoreAPI;
using System.Collections.Generic;

public static class AuthorizationSetup
{
    public static void InitializeRolesAndPermissions(IServiceProvider serviceProvider)
    {
        using (var scope = serviceProvider.CreateScope())
        {
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var rolesAndPermissions = new List<(string RoleName, List<string> Permissions)>
            {
                ("Admin", new List<string>
                {
                    PermissionDefinitions.AdminPermissions.ManageUsers,
                    PermissionDefinitions.AdminPermissions.ManageSettings
                }),
                ("Customer", new List<string>
                {
                    PermissionDefinitions.CustomerPermissions.Create,
                    PermissionDefinitions.CustomerPermissions.Read,
                    PermissionDefinitions.CustomerPermissions.Update,
                    PermissionDefinitions.CustomerPermissions.Delete,
                }),
                ("Company", new List<string>
                {
                    PermissionDefinitions.CustomerPermissions.Create,
                    PermissionDefinitions.CustomerPermissions.Read,
                    PermissionDefinitions.CustomerPermissions.Update,
                    PermissionDefinitions.CustomerPermissions.Delete,
                }),
            };

            foreach (var (roleName, permissions) in rolesAndPermissions)
            {
                //if (!roleManager.RoleExistsAsync(roleName).Result)
                //{
                //    var role = new IdentityRole(roleName);
                //    roleManager.CreateAsync(role).Wait();

                //    var existingRole = roleManager.FindByNameAsync(roleName).Result;

                //    foreach (var permission in permissions)
                //    {
                //        dbContext.RoleClaims.AddAsync(new IdentityRoleClaim<string>
                //        {
                //            RoleId = existingRole.Id,
                //            ClaimType = "permission",
                //            ClaimValue = permission
                //        });
                //    }
                //}
            }

            dbContext.SaveChangesAsync().Wait();
        }
    }
}
