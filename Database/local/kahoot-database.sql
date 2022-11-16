USE sys;
DROP DATABASE IF EXISTS kahoot_database;
CREATE DATABASE IF NOT EXISTS kahoot_database;
USE kahoot_database;

CREATE TABLE users (
	users_id char(36),
    users_name nvarchar(100),
    email nchar(255),
    users_password nchar(255),
    is_verified bool default false,
    create_at datetime,
    expire_at datetime,
    tokens nchar(255),
    
    constraint pk_users
    primary key(users_id)
);

CREATE TABLE kahoot_groups (
	groups_id char(36),
    groups_name nchar(100),
    is_deleted bool default false,
    
    constraint pk_groups
    primary key(groups_id)
);

CREATE TABLE roles (
	roles_id int,
    roles_name nchar(100),
    
    constraint pk_roles
    primary key(roles_id)
);

CREATE TABLE roles_groups_users (
	users_id char(36),
    groups_id char(36),
    roles_id int,
    
    constraint pk_roles_groups_users
    primary key(users_id, groups_id, roles_id)
);

ALTER TABLE roles_groups_users
ADD FOREIGN KEY (users_id) REFERENCES users(users_id);
ALTER TABLE roles_groups_users
ADD FOREIGN KEY (groups_id) REFERENCES kahoot_groups(groups_id);
ALTER TABLE roles_groups_users
ADD FOREIGN KEY (roles_id) REFERENCES roles(roles_id);

INSERT users (users_id, users_name, email, users_password, is_verified, create_at, expire_at, tokens)
VALUES('us001', N'Jimmy Nguyen', 'jun@gmail.com', '$2b$10$9s9CNAy9HLGzlB7V0SUBuuiuGTWSbG9Iogd4Xgv7B2K09UbDF6NP2', false, '2002-12-3', '2022-12-3', '12323231'),
('us002', N'Jack Tran', 'Jack@gmail.com', '$2b$10$9s9CNAy9HLGzlB7V0SUBuuiuGTWSbG9Iogd4Xgv7B2K09UbDF6NP2', false, '2002-12-3', '2022-12-3', '12323231'),
('us003', N'Linda Ngo', 'Linda@gmail.com', '$2b$10$9s9CNAy9HLGzlB7V0SUBuuiuGTWSbG9Iogd4Xgv7B2K09UbDF6NP2', false, '2002-12-3', '2022-12-3', '12323231'),
('us004', N'Lunna Vo', 'Lunna@gmail.com', '$2b$10$9s9CNAy9HLGzlB7V0SUBuuiuGTWSbG9Iogd4Xgv7B2K09UbDF6NP2', false, '2002-12-3', '2022-12-3', '12323231'),
('us005', N'Peter Le', 'Peter@gmail.com', '$2b$10$9s9CNAy9HLGzlB7V0SUBuuiuGTWSbG9Iogd4Xgv7B2K09UbDF6NP2', false, '2002-12-3', '2022-12-3', '12323231');

INSERT kahoot_groups (groups_id, groups_name, is_deleted)
VALUES('gr001', 'learn english', false),
('gr002', 'learn french', false),
('gr003', 'learn chinese', false),
('gr004', 'learn japanees', false),
('gr005', 'learn spanish', false);

INSERT roles (roles_id, roles_name)
VALUES(1, 'owner'),
(2, 'co-owner'),
(3, 'member');

INSERT roles_groups_users (users_id, groups_id, roles_id)
VALUES('us001', 'gr001', 1),
('us002', 'gr001', 3),
('us003', 'gr001', 3),
('us004', 'gr001', 2),
('us002', 'gr002', 1),
('us003', 'gr002', 3),
('us001', 'gr002', 2),
('us003', 'gr003', 1),
('us002', 'gr003', 3),
('us004', 'gr003', 3),
('us004', 'gr004', 1),
('us005', 'gr004', 3),
('us001', 'gr004', 2),
('us005', 'gr005', 1),
('us004', 'gr005', 3),
('us002', 'gr005', 2);

drop procedure if exists sp_addidusers;
DELIMITER //
create procedure sp_addidusers()
begin
	set @prefix = 'us';
	set @ID = concat(@prefix, '001');
	set @ID_I = 1;
	myloop: while @ID <> 'PT000' do
				if (not exists(select * from users where users_id = @ID)) then
					insert users(users_id) values(@ID);
					leave myloop;
				else
					set @ID_I = @ID_I + 1;
                    if @ID_I > 99 then
						set @ID = concat('us', convert(@ID_I, char(3)));
					elseif @ID_I > 9 then
						set @ID = concat('us0', convert(@ID_I, char(2)));
					else
						set @ID = concat('us00', convert(@ID_I, char(1)));
                    end if;
                end if;
	end while;
end//
DELIMITER ;

-- call sp_addidusers();

select * from users;

-- update users set users_name = 'a1', email = 'a2', users_password = 'a3' where users_id = 'us002'