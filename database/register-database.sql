USE b03csmxdmazgc2u6l278;

CREATE TABLE users (
	users_id char(36),
    users_name nvarchar(100),
    email nchar(255),
    users_password nchar(255),
    is_teacher bool DEFAULT false,
    
    constraint pk_users
    primary key(users_id)
);

INSERT users (users_id, users_name, email, users_password, is_teacher)
VALUES('us001', N'khoa nguyen', 'khoa@gmail.com', '$2b$10$9s9CNAy9HLGzlB7V0SUBuuiuGTWSbG9Iogd4Xgv7B2K09UbDF6NP2', false);

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