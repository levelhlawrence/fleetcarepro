# Custom migration to create employees table
from django.db import migrations

class Migration(migrations.Migration):
    
    dependencies = [
        ('api', '0008_alter_employee_options'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]
    
    operations = [
        migrations.RunSQL(
            """
            CREATE TABLE IF NOT EXISTS employees (
                id bigserial PRIMARY KEY,
                password character varying(128) NOT NULL,
                last_login timestamp with time zone,
                is_superuser boolean NOT NULL DEFAULT false,
                username character varying(150) NOT NULL UNIQUE,
                first_name character varying(150) NOT NULL DEFAULT '',
                last_name character varying(150) NOT NULL DEFAULT '',
                is_staff boolean NOT NULL DEFAULT false,
                is_active boolean NOT NULL DEFAULT true,
                date_joined timestamp with time zone NOT NULL DEFAULT NOW(),
                email character varying(254) NOT NULL UNIQUE,
                city character varying(100),
                state character varying(100),
                zipcode character varying(20),
                address character varying(255),
                number character varying(15),
                department character varying(100) NOT NULL DEFAULT '',
                employee_id character varying(50) UNIQUE,
                notes text,
                date_of_birth date,
                created_at timestamp with time zone NOT NULL DEFAULT NOW(),
                updated_at timestamp with time zone NOT NULL DEFAULT NOW()
            );
            
            CREATE TABLE IF NOT EXISTS employees_groups (
                id bigserial PRIMARY KEY,
                employee_id bigint NOT NULL,
                group_id integer NOT NULL,
                CONSTRAINT employees_groups_employee_id_group_id_unique UNIQUE (employee_id, group_id)
            );
            
            CREATE TABLE IF NOT EXISTS employees_user_permissions (
                id bigserial PRIMARY KEY,
                employee_id bigint NOT NULL,
                permission_id integer NOT NULL,
                CONSTRAINT employees_user_permissions_employee_id_permission_id_unique UNIQUE (employee_id, permission_id)
            );
            
            -- Add foreign key constraints
            ALTER TABLE employees_groups 
            ADD CONSTRAINT employees_groups_employee_id_fkey 
            FOREIGN KEY (employee_id) REFERENCES employees(id) DEFERRABLE INITIALLY DEFERRED;
            
            ALTER TABLE employees_groups 
            ADD CONSTRAINT employees_groups_group_id_fkey 
            FOREIGN KEY (group_id) REFERENCES auth_group(id) DEFERRABLE INITIALLY DEFERRED;
            
            ALTER TABLE employees_user_permissions 
            ADD CONSTRAINT employees_user_permissions_employee_id_fkey 
            FOREIGN KEY (employee_id) REFERENCES employees(id) DEFERRABLE INITIALLY DEFERRED;
            
            ALTER TABLE employees_user_permissions 
            ADD CONSTRAINT employees_user_permissions_permission_id_fkey 
            FOREIGN KEY (permission_id) REFERENCES auth_permission(id) DEFERRABLE INITIALLY DEFERRED;
            """,
            reverse_sql="DROP TABLE IF EXISTS employees CASCADE; DROP TABLE IF EXISTS employees_groups; DROP TABLE IF EXISTS employees_user_permissions;"
        )
    ]
