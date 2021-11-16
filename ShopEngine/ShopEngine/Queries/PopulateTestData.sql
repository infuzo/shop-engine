USE shopenginedata;

GO
CREATE FUNCTION dbo.GetCategoryGuidByName(@name AS NVARCHAR(max))
	RETURNS UNIQUEIDENTIFIER
BEGIN 
	RETURN (SELECT Id
	FROM dbo.Categories
	WHERE Name = @name);
END
GO

INSERT INTO dbo.Categories(Name, Description)
VALUES
	(N'Computers, notebooks, accessoreis', N'Computers, notebooks, accessoreis'),
	(N'Smartphones', N'Smartphones'),
	(N'Kitchen Appliances', N'Kitchen Appliances');
GO

DECLARE @ComputersNotebooksAccessoriesGuid UNIQUEIDENTIFIER;
SET @ComputersNotebooksAccessoriesGuid = dbo.GetCategoryGuidByName(N'Computers, notebooks, accessoreis');

INSERT INTO dbo.Categories(Name, Description, SubCategoryGuid)
VALUES
	(N'Computers', N'Computers', @ComputersNotebooksAccessoriesGuid),
	(N'Notebooks', N'Notebooks', @ComputersNotebooksAccessoriesGuid),
	(N'Computer components', N'Computer components', @ComputersNotebooksAccessoriesGuid),
	(N'Accessoreis', N'Accessoreis', @ComputersNotebooksAccessoriesGuid);
GO

DECLARE @ComputerComponentsGuid UNIQUEIDENTIFIER;
SET @ComputerComponentsGuid = dbo.GetCategoryGuidByName(N'Computer components');

INSERT INTO dbo.Categories(Name, Description, SubCategoryGuid)
VALUES
	(N'Processors', N'Processors', @ComputerComponentsGuid),
	(N'Videocards', N'Videocards', @ComputerComponentsGuid),
	(N'Motherboards', N'Motherboards', @ComputerComponentsGuid),
	(N'RAM', N'RAM', @ComputerComponentsGuid),
	(N'Storages', N'Storages', @ComputerComponentsGuid),
	(N'Cases', N'Cases', @ComputerComponentsGuid);
GO

DECLARE @StoragesGuid UNIQUEIDENTIFIER;
SET @StoragesGuid = dbo.GetCategoryGuidByName(N'Storages');
DECLARE @CasesGuid UNIQUEIDENTIFIER;
SET @CasesGuid = dbo.GetCategoryGuidByName(N'Cases');

INSERT INTO dbo.Categories(Name, Description, SubCategoryGuid)
VALUES
	(N'SSD', N'SSD', @StoragesGuid),
	(N'HDD', N'HDD', @StoragesGuid),
	(N'Towers', N'Towers', @CasesGuid),
	(N'Desktops', N'Desktops', @CasesGuid);
GO

DECLARE @AccessoriesGuid UNIQUEIDENTIFIER;
SET @AccessoriesGuid = dbo.GetCategoryGuidByName(N'Accessoreis');

INSERT INTO dbo.Categories(Name, Description, SubCategoryGuid)
VALUES
	(N'Keyboards', N'Keyboards', @AccessoriesGuid),
	(N'Mouses', N'Mouses', @AccessoriesGuid),
	(N'Headphones', N'Headphones', @AccessoriesGuid);
GO

DECLARE @KitchenAppliances UNIQUEIDENTIFIER;
SET @KitchenAppliances = dbo.GetCategoryGuidByName(N'Kitchen Appliances');

INSERT INTO dbo.Categories(Name, Description, SubCategoryGuid)
VALUES
	(N'Microwaves', N'Microwaves', @KitchenAppliances),
	(N'Vacuum Cleaners', N'Vacuum Cleaners', @KitchenAppliances);
GO

DECLARE @ComputersGuid UNIQUEIDENTIFIER;
SET @ComputersGuid = dbo.GetCategoryGuidByName(N'Computers');

INSERT INTO dbo.Products(Name, SpecificationsJson, Price, InStock, CategoryId, ImagesUrlJson, PreviewImageIndex)
VALUES
	(N'Dell OptiPlex 3070 MFF', N'{}', 12499, 1, @ComputersGuid, N'{}', 0),
	(N'Acer Veriton S2660G', '{}', 9799, 1, @ComputersGuid, N'{}', 0),
	(N'Artline Gaming X39 v25', '{}', 15999, 1, @ComputersGuid, N'{}', 0),
	(N'Everest Home 4070', '{}', 11699, 1, @ComputersGuid, N'{}', 0),
	(N'ARTLINE Gaming X39 v33', '{}', 21399, 1, @ComputersGuid, N'{}', 0),
	(N'Artline Home H25 v15', '{}', 5199, 1, @ComputersGuid, N'{}', 0),
	(N'ћоноблок HP AiO 20-c412ur', '{}', 7499, 1, @ComputersGuid, N'{}', 0),
	(N'Dell OptiPlex 3060 SFF', '{}', 10299, 1, @ComputersGuid, N'{}', 0),
	(N'ћоноблок HP AiO 20-c401ur White', '{}', 7099, 1, @ComputersGuid, N'{}', 0),
	(N'ARTLINE Gaming X48 v09', '{}', 15999, 0, @ComputersGuid, N'{}', 0),
	(N'Acer Aspire C24-865 (DQ.BBTME.005) Silver', '{}', 15999, 0, @ComputersGuid, N'{}', 0),
	(N'Artline Business B27 (B27v29)', '{}', 7842, 0, @ComputersGuid, N'{}', 0),
	(N'ARTLINE Gaming X26 v09', '{}', 10699, 0, @ComputersGuid, N'{}', 0),
	(N'Artline Gaming X35 v15 (X35v15)', '{}', 12099, 0, @ComputersGuid, N'{}', 0);
GO

DECLARE @NotebooksGuid UNIQUEIDENTIFIER;
SET @NotebooksGuid = dbo.GetCategoryGuidByName(N'Notebooks');

INSERT INTO dbo.Products(Name, SpecificationsJson, Price, InStock, CategoryId, ImagesUrlJson, PreviewImageIndex)
VALUES
	(N'Asus ROG Strix G531GT-BQ132', N'{}', 22999, 1, @NotebooksGuid, N'{}', 0),
	(N'HP Pavilion Gaming 15-cx0027ua', N'{}', 18999, 0, @NotebooksGuid, N'{}', 0),
	(N'HP Pavilion Gaming 15-bc504ur', N'{}', 16499, 0, @NotebooksGuid, N'{}', 0),
	(N'Acer Aspire 5 A515-54G', N'{}', 15499, 1, @NotebooksGuid, N'{}', 0),
	(N'Lenovo IdeaPad 330-15AST', N'{}', 5699, 1, @NotebooksGuid, N'{}', 0),
	(N'ASUS ZenBook 14 UX433FN-A5409', N'{}', 22999, 1, @NotebooksGuid, N'{}', 0),
	(N'Asus X509FL-BQ053', N'{}', 15999, 1, @NotebooksGuid, N'{}', 0),
	(N'MSI Modern 14', N'{}', 17499, 1, @NotebooksGuid, N'{}', 0),
	(N'Lenovo IdeaPad 330-15ICH', N'{}', 15999, 1, @NotebooksGuid, N'{}', 0),
	(N'Acer Aspire 5 A517-51G-546B', N'{}', 15999, 0, @NotebooksGuid, N'{}', 0),
	(N'HP Pavilion Gaming 15-cx0028ua', N'{}', 20499, 1, @NotebooksGuid, N'{}', 0),
	(N'ASUS ZenBook 13 UX333FA-A4149T', N'{}', 19999, 1, @NotebooksGuid, N'{}', 0),
	(N'Lenovo IdeaPad S340-15API', N'{}', 12799, 1, @NotebooksGuid, N'{}', 0),
	(N'Lenovo IdeaPad 330-15IKB', N'{}', 10777, 1, @NotebooksGuid, N'{}', 0);
GO

DECLARE @ProcessorsGuid UNIQUEIDENTIFIER;
SET @ProcessorsGuid = dbo.GetCategoryGuidByName(N'Processors');

INSERT INTO dbo.Products(Name, SpecificationsJson, Price, InStock, CategoryId, ImagesUrlJson, PreviewImageIndex)
VALUES
	(N'AMD Ryzen 5 3600 3.6GHz/32MB', N'{}', 5430, 1, @ProcessorsGuid, N'{}', 0),
	(N'Intel Core i5-9400F 2.9GHz/8GT/s/9MB', N'{}', 4550, 1, @ProcessorsGuid, N'{}', 0),
	(N'HP Intel Xeon E5-2609v3 DL160 Gen9 Kit', N'{}', 14399, 1, @ProcessorsGuid, N'{}', 0),
	(N'Intel Core i7-9700F 3.0GHz/8GT/s/12MB', N'{}', 9650, 0, @ProcessorsGuid, N'{}', 0),
	(N'Intel Core i3-8100 3.6GHz/8GT/s/6MB', N'{}', 3555, 1, @ProcessorsGuid, N'{}', 0),
	(N'AMD Ryzen 5 2600X 3.6GHz/16MB', N'{}', 3989, 1, @ProcessorsGuid, N'{}', 0),
	(N'Intel Pentium Gold G5420 3.8GHz/8GT/s/4MB', N'{}', 1790, 1, @ProcessorsGuid, N'{}', 0),
	(N'Intel Core i5-8400 2.8GHz/8GT/s/9MB', N'{}', 5850, 1, @ProcessorsGuid, N'{}', 0),
	(N'HP Intel Xeon E5-2609v3 ML150 Gen9 Kit', N'{}', 13999, 0, @ProcessorsGuid, N'{}', 0),
	(N'Intel Core i7-9700K 3.6GHz/8GT/s/12MB', N'{}', 11850, 1, @ProcessorsGuid, N'{}', 0),
	(N'Intel Core i5-9600KF 3.7GHz/8GT/s/9MB', N'{}', 6137, 0, @ProcessorsGuid, N'{}', 0),
	(N'Intel Core i3-9100F 3.6GHz/8GT/s/6MB', N'{}', 2249, 0, @ProcessorsGuid, N'{}', 0),
	(N'AMD Ryzen 9 3900X 3.8GHz/64MB', N'{}', 14945, 0, @ProcessorsGuid, N'{}', 0),
	(N'AMD Ryzen 5 2600 3.4GHz/16MB', N'{}', 3729, 1, @ProcessorsGuid, N'{}', 0);
GO

DECLARE @VideocardsGuid UNIQUEIDENTIFIER;
SET @VideocardsGuid = dbo.GetCategoryGuidByName(N'Videocards');

INSERT INTO dbo.Products(Name, SpecificationsJson, Price, InStock, CategoryId, ImagesUrlJson, PreviewImageIndex)
VALUES
	(N'Sapphire PCI-Ex Radeon RX 5600 XT Pulse 6GB GDDR6', N'{}', 8699, 1, @VideocardsGuid, N'{}', 0),
	(N'Sapphire PCI-Ex Radeon RX 5500 XT 8G Pulse 8GB GDDR6', N'{}', 6088, 1, @VideocardsGuid, N'{}', 0),
	(N'Sapphire PCI-Ex Radeon RX 5700 XT 8G Pulse 8GB GDDR6 (256bit)', N'{}', 11549, 1, @VideocardsGuid, N'{}', 0),
	(N'AFOX PCI-Ex GeForce G210 1GB DDR3 (64bit)', N'{}', 789, 0, @VideocardsGuid, N'{}', 0),
	(N'Asus PCI-Ex GeForce GTX 1050 Ti Phoenix 4GB GDDR5 (128bit)', N'{}', 3919, 1, @VideocardsGuid, N'{}', 0),
	(N'Asus PCI-Ex Radeon RX580 ROG Strix OC 8GB GDDR5', N'{}', 6319, 1, @VideocardsGuid, N'{}', 0),
	(N'Asus PCI-Ex GeForce GTX 1050 Ti ROG Strix 4GB GDDR5 (128bit)', N'{}', 4249, 1, @VideocardsGuid, N'{}', 0),
	(N'Asus PCI-Ex GeForce GT 710 1GB GDDR5 (32bit)', N'{}', 1019, 0, @VideocardsGuid, N'{}', 0),
	(N'Gigabyte PCI-Ex GeForce RTX 2080 Super Aorus Waterforce WB 8G 8GB GDDR6 (256bit)', N'{}', 23547, 1, @VideocardsGuid, N'{}', 0),
	(N'Asus PCI-Ex GeForce GT 1030 Phoenix OC 2GB GDDR5 (64bit)', N'{}', 2439, 1, @VideocardsGuid, N'{}', 0),
	(N'Asus PCI-Ex GeForce GTX 1650 Dual O4G OC 4GB GDDR5 (128bit)', N'{}', 4527, 0, @VideocardsGuid, N'{}', 0),
	(N'Asus PCI-Ex GeForce GTX 1650 Phoenix O4G OC 4GB GDDR5 (128bit)', N'{}', 4339, 0, @VideocardsGuid, N'{}', 0),
	(N'Asus PCI-Ex GeForce GTX 1660 Super TUF Gaming X3 OC 6GB GDDR6 (192bit)', N'{}', 7526, 1, @VideocardsGuid, N'{}', 0),
	(N'Gigabyte PCI-Ex GeForce RTX 2080 Ti Aorus Xtreme Waterforce 11GB GDDR6 (352bit)', N'{}', 41768, 1, @VideocardsGuid, N'{}', 0),
	(N'Sapphire PCI-Ex Radeon RX 5700 XT NITRO+ 8GB GDDR6 (256bit)', N'{}', 13009, 1, @VideocardsGuid, N'{}', 0);
GO

DECLARE @MotherboardsGuid UNIQUEIDENTIFIER;
SET @MotherboardsGuid = dbo.GetCategoryGuidByName(N'Motherboards');

INSERT INTO dbo.Products(Name, SpecificationsJson, Price, InStock, CategoryId, ImagesUrlJson, PreviewImageIndex)
VALUES
	(N'Asus Prime H310M-R R2.0', N'{}', 1434, 1, @MotherboardsGuid, N'{}', 0),
	(N'Asus Prime B360-Plus', N'{}', 2649, 1, @MotherboardsGuid, N'{}', 0),
	(N'MSI B450 Tomahawk Max', N'{}', 2999, 1, @MotherboardsGuid, N'{}', 0),
	(N'Asus TUF B450-Pro Gaming', N'{}', 2640, 1, @MotherboardsGuid, N'{}', 0),
	(N'MSI B450 Gaming Plus Max', N'{}', 2550, 1, @MotherboardsGuid, N'{}', 0),
	(N'Asus Prime A320M-K', N'{}', 1295, 0, @MotherboardsGuid, N'{}', 0),
	(N'MSI MAG Z390 Tomahawk', N'{}', 4185, 0, @MotherboardsGuid, N'{}', 0),
	(N'Asus Prime B360M-A', N'{}', 2160, 0, @MotherboardsGuid, N'{}', 0),
	(N'Asus Prime B450M-A', N'{}', 1999, 0, @MotherboardsGuid, N'{}', 0),
	(N'Asus Prime B450-PLUS', N'{}', 2420, 1, @MotherboardsGuid, N'{}', 0),
	(N'Asus Prime Z390M-Plus', N'{}', 3510, 1, @MotherboardsGuid, N'{}', 0),
	(N'Asus TUF B450M-Plus Gaming', N'{}', 2449, 1, @MotherboardsGuid, N'{}', 0),
	(N'MSI B450M Pro-M2 Max', N'{}', 1674, 1, @MotherboardsGuid, N'{}', 0),
	(N'MSI B450M PRO-VDH MAX', N'{}', 1999, 1, @MotherboardsGuid, N'{}', 0),
	(N'Asus ROG Strix B450-F Gaming', N'{}', 3705, 1, @MotherboardsGuid, N'{}', 0);
GO

DECLARE @RAMGuid UNIQUEIDENTIFIER;
SET @RAMGuid = dbo.GetCategoryGuidByName(N'RAM');

INSERT INTO dbo.Products(Name, SpecificationsJson, Price, InStock, CategoryId, ImagesUrlJson, PreviewImageIndex)
VALUES
	(N'HyperX DDR4-2666 16384MB PC4-21300', N'{}', 2055, 1, @RAMGuid, N'{}', 0),
	(N'Kingston DDR3-1600 4096MB PC3-12800', N'{}', 589, 1, @RAMGuid, N'{}', 0),
	(N'HyperX DDR4-3200 8192MB PC4-25600 Fury Black', N'{}', 1199, 0, @RAMGuid, N'{}', 0),
	(N'Kingston DDR3-1600 8192MB PC3-12800', N'{}', 1079, 0, @RAMGuid, N'{}', 0),
	(N'Kingston DDR4-2400 8192MB PC4-19200', N'{}', 969, 1, @RAMGuid, N'{}', 0),
	(N'HyperX DDR4-3000 8192MB PC4-24000 Fury Black', N'{}', 1190, 1, @RAMGuid, N'{}', 0),
	(N'HyperX DDR4-2666 8192MB PC4-21300 Fury Black', N'{}', 1055, 1, @RAMGuid, N'{}', 0),
	(N'Kingston SODIMM DDR3L-1600 8192MB PC3L-12800', N'{}', 1091, 1, @RAMGuid, N'{}', 0),
	(N'HyperX DDR4-3200 16384MB PC4-25600 Predator RGB Black', N'{}', 2569, 0, @RAMGuid, N'{}', 0),
	(N'HyperX DDR4-3200 8192MB PC4-25600 Predator RGB', N'{}', 1420, 1, @RAMGuid, N'{}', 0),
	(N'HyperX DDR4-3733 16384MB PC4-29864 Fury Black', N'{}', 2890, 1, @RAMGuid, N'{}', 0),
	(N'HyperX DDR4-3000 16384MB PC4-24000 Predator RGB Black', N'{}', 2808, 1, @RAMGuid, N'{}', 0),
	(N'HyperX DDR4-3600 8192MB PC4-28800 Fury Black', N'{}', 1490, 0, @RAMGuid, N'{}', 0),
	(N'HyperX DDR4-3200 16384MB PC4-25600 (Kit of 2x8192) Predator Black', N'{}', 2615, 0, @RAMGuid, N'{}', 0),
	(N'Kingston DDR3-1333 4096MB PC3-10600', N'{}', 555, 0, @RAMGuid, N'{}', 0);
GO

DECLARE @SSDGuid UNIQUEIDENTIFIER;
SET @SSDGuid = dbo.GetCategoryGuidByName(N'SSD');

INSERT INTO dbo.Products(Name, SpecificationsJson, Price, InStock, CategoryId, ImagesUrlJson, PreviewImageIndex)
VALUES
	(N'Kingston SSD HyperX Fury 3D 240GB 2.5" SATAIII TLC', N'{}', 1169, 0, @SSDGuid, N'{}', 0),
	(N'Samsung 860 Evo-Series 250GB 2.5" SATA III V-NAND (MLC)', N'{}', 1299, 1, @SSDGuid, N'{}', 0),
	(N'Samsung PM883 Enterprise 1.92TB 2.5" SATA III TLC', N'{}', 11750, 1, @SSDGuid, N'{}', 0),
	(N'Kingston DC450R 480GB 2.5" SATAIII 3D TLC', N'{}', 2459, 1, @SSDGuid, N'{}', 0),
	(N'Samsung 860 Evo-Series 500GB 2.5" SATA III V-NAND TLC', N'{}', 2299, 0, @SSDGuid, N'{}', 0),
	(N'Kingston SSDNow A400 120GB 2.5" SATAIII TLC', N'{}', 779, 1, @SSDGuid, N'{}', 0),
	(N'Silicon Power Slim S60 480GB 2.5" SATAIII MLC', N'{}', 3299, 1, @SSDGuid, N'{}', 0),
	(N'Apacer AS2280P2 480GB NVMe M.2 PCIe 3.0 x2 3D NAND TLC', N'{}', 1947, 1, @SSDGuid, N'{}', 0),
	(N'Seagate Game Drive for Xbox SSD 1TB USB 3.0', N'{}', 5329, 1, @SSDGuid, N'{}', 0),
	(N'Samsung 860 Evo-Series 250GB M.2 SATA III V-NAND MLC', N'{}', 1299, 0, @SSDGuid, N'{}', 0),
	(N'Kingston SSDNow A400 240GB 2.5" SATAIII TLC', N'{}', 1169, 1, @SSDGuid, N'{}', 0),
	(N'Samsung 860 QVO 1TB 2.5" SATA III V-NAND QLC', N'{}', 3199, 1, @SSDGuid, N'{}', 0),
	(N'Kingston SSD HyperX Fury 3D 480GB 2.5" SATAIII 3D NAND TLC', N'{}', 1999, 0, @SSDGuid, N'{}', 0),
	(N'Kingston SSDNow A400 480GB 2.5" SATAIII 3D V-NAND', N'{}', 2019, 1, @SSDGuid, N'{}', 0),
	(N'Goodram SSD CL100 Gen.2 240GB SATA III 2.5', N'{}', 1039, 1, @SSDGuid, N'{}', 0);
GO

DECLARE @HDDGuid UNIQUEIDENTIFIER;
SET @HDDGuid = dbo.GetCategoryGuidByName(N'HDD');

INSERT INTO dbo.Products(Name, SpecificationsJson, Price, InStock, CategoryId, ImagesUrlJson, PreviewImageIndex)
VALUES
	(N'Verbatim Store n Go 1TB 53023 2.5" USB 3.0 External Blister Black', N'{}', 1289, 1, @HDDGuid, N'{}', 0),
	(N'Verbatim Store n Go 500GB 53029 2.5 USB 3.0 External Black', N'{}', 1039, 0, @HDDGuid, N'{}', 0),
	(N'Apacer AC236 1TB 5400rpm 8MB AP1TBAC236U-1 2.5" USB 3.1 External Blue', N'{}', 1249, 1, @HDDGuid, N'{}', 0),
	(N'Silicon Power Armor A30 2TB SP020TBPHDA30S3K 2.5 USB 3.0 External Black', N'{}', 1959, 1, @HDDGuid, N'{}', 0),
	(N'Seagate FireCuda Gaming Dock 4TB STJF4000400 3.5 Thunderbolt 3', N'{}', 10999, 1, @HDDGuid, N'{}', 0),
	(N'Dell 4TB 7200rpm 400-ATKL(ST4000NM0295) 3.5" 512n NL-SAS Hot-plug 14G', N'{}', 5299, 0, @HDDGuid, N'{}', 0),
	(N'Silicon Power Armor A60 5TB SP050TBPHDA60S3K 2.5" USB 3.1 External Black', N'{}', 3999, 1, @HDDGuid, N'{}', 0),
	(N'Western Digital Ultrastar DC HC530 14TB 7200rpm 512MB', N'{}', 11507, 1, @HDDGuid, N'{}', 0),
	(N'Silicon Power Armor A80 2TB SP020TBPHDA80S3B 2.5 USB 3.1 External Blue', N'{}', 1971, 1, @HDDGuid, N'{}', 0),
	(N'Silicon Power Armor A80 2TB SP020TBPHDA80S3K 2.5 USB 3.1 External Black', N'{}', 1999, 1, @HDDGuid, N'{}', 0);
GO

DECLARE @TowersGuid UNIQUEIDENTIFIER;
SET @TowersGuid = dbo.GetCategoryGuidByName(N'Towers');

INSERT INTO dbo.Products(Name, SpecificationsJson, Price, InStock, CategoryId, ImagesUrlJson, PreviewImageIndex)
VALUES
	(N'Crown CMC-605 450 Black', N'{}', 825, 1, @TowersGuid, N'{}', 0),
	(N'Crown CMC-410 400 Black', N'{}', 659, 1, @TowersGuid, N'{}', 0),
	(N'DeepCool Wave V2', N'{}', 749, 1, @TowersGuid, N'{}', 0),
	(N'DeepCool Matrexx 30 Black', N'{}', 888, 1, @TowersGuid, N'{}', 0),
	(N'DeepCool Smarter LED Black', N'{}', 771, 1, @TowersGuid, N'{}', 0),
	(N'Deepcool Gamerstorm Macube 550', N'{}', 2358, 1, @TowersGuid, N'{}', 0),
	(N'DeepCool Matrexx 70 Black', N'{}', 2089, 0, @TowersGuid, N'{}', 0),
	(N'DeepCool Matrexx 55 Black', N'{}', 1429, 0, @TowersGuid, N'{}', 0),
	(N'Gamemax ET-211-U3 NP', N'{}', 459, 1, @TowersGuid, N'{}', 0),
	(N'GameMax ST-610W', N'{}', 769, 0, @TowersGuid, N'{}', 0),
	(N'GameMax ET-205-NP', N'{}', 369, 1, @TowersGuid, N'{}', 0),
	(N'Gamemax ET-209-NP', N'{}', 369, 1, @TowersGuid, N'{}', 0),
	(N'Chieftec CI-01B-OP', N'{}', 1128, 1, @TowersGuid, N'{}', 0),
	(N'Fractal Design Meshify C Ц TG White', N'{}', 2603, 1, @TowersGuid, N'{}', 0),
	(N'Fractal Design Define R5 Titanium', N'{}', 3246, 1, @TowersGuid, N'{}', 0);
GO

DECLARE @DesktopsGuid UNIQUEIDENTIFIER;
SET @DesktopsGuid = dbo.GetCategoryGuidByName(N'Desktops');

INSERT INTO dbo.Products(Name, SpecificationsJson, Price, InStock, CategoryId, ImagesUrlJson, PreviewImageIndex)
VALUES
	(N'GameMax ST-610W', N'{}', 769, 1, @DesktopsGuid, N'{}', 0),
	(N'GameMax ST-607 300', N'{}', 718, 1, @DesktopsGuid, N'{}', 0),
	(N'GameMax ST-610G', N'{}', 718, 0, @DesktopsGuid, N'{}', 0),
	(N'Cougar QBX Black', N'{}', 1699, 1, @DesktopsGuid, N'{}', 0),
	(N'LogicPower LP S607 BK 400', N'{}', 873, 1, @DesktopsGuid, N'{}', 0),
	(N'LogicPower LP S620 400', N'{}', 744, 1, @DesktopsGuid, N'{}', 0),
	(N'LogicPower LP S602 BS 400', N'{}', 895, 1, @DesktopsGuid, N'{}', 0),
	(N'LogicPower LP S605 BK 400', N'{}', 873, 0, @DesktopsGuid, N'{}', 0),
	(N'Cooler Master Elite 120', N'{}', 1268, 0, @DesktopsGuid, N'{}', 0),
	(N'Cougar QBX', N'{}', 1890, 1, @DesktopsGuid, N'{}', 0),
	(N'FRACTAL DESIGN Node 202 + Integra SFX 450W PSU', N'{}', 4182, 1, @DesktopsGuid, N'{}', 0),
	(N'CHIEFTEC FLYER', N'{}', 1802, 1, @DesktopsGuid, N'{}', 0),
	(N'GAMEMAX M100-M', N'{}', 1169, 1, @DesktopsGuid, N'{}', 0),
	(N'GAMEMAX ST102-U3', N'{}', 877, 1, @DesktopsGuid, N'{}', 0),
	(N'FRACTAL DESIGN Node 202 + Integra SFX 450W PSU', N'{}', 4219, 0, @DesktopsGuid, N'{}', 0),
	(N'FRACTAL DESIGN FD-MCA-NODE-202-AA-EU', N'{}', 4595, 1, @DesktopsGuid, N'{}', 0);
GO

DECLARE @KeyboardsGuid UNIQUEIDENTIFIER;
SET @KeyboardsGuid = dbo.GetCategoryGuidByName(N'Keyboards');

INSERT INTO dbo.Products(Name, SpecificationsJson, Price, InStock, CategoryId, ImagesUrlJson, PreviewImageIndex)
VALUES
	(N'MSI Interceptor DS4100 USB UKR', N'{}', 799, 1, @KeyboardsGuid, N'{}', 0),
	(N'Real-El 8700 Backlit USB', N'{}', 329, 1, @KeyboardsGuid, N'{}', 0),
	(N'HyperX Alloy FPS Pro Cherry MX Red USB', N'{}', 1999, 0, @KeyboardsGuid, N'{}', 0),
	(N'Logitech G512 RGB Mechanical Gaming GX Blue Switch USB Carbon', N'{}', 5999, 1, @KeyboardsGuid, N'{}', 0),
	(N'Logitech K120 USB RUS OEM', N'{}', 299, 1, @KeyboardsGuid, N'{}', 0),
	(N'A4Tech KD-126-2 C белой подсветкой USB', N'{}', 539, 1, @KeyboardsGuid, N'{}', 0),
	(N'Logitech K270', N'{}', 699, 1, @KeyboardsGuid, N'{}', 0),
	(N'Aula Fireshock V5 Mechanical Wired Keyboard EN/RU/UA', N'{}', 1299, 1, @KeyboardsGuid, N'{}', 0),
	(N'Logitech K280e USB', N'{}', 549, 0, @KeyboardsGuid, N'{}', 0),
	(N'HyperX Alloy FPS RGB Kailh Speed Silver USB', N'{}', 3299, 0, @KeyboardsGuid, N'{}', 0),
	(N'Aula Dragon Deep USB', N'{}', 369, 1, @KeyboardsGuid, N'{}', 0),
	(N'Logitech G213 Prodigy USB', N'{}', 1499, 1, @KeyboardsGuid, N'{}', 0),
	(N'HyperX Alloy FPS Cherry MX Blue USB', N'{}', 2199, 1, @KeyboardsGuid, N'{}', 0),
	(N'Dell Multimedia KB-216 USB', N'{}', 271, 1, @KeyboardsGuid, N'{}', 0),
	(N'Modecom Volcano Blade Ultra Slim USB', N'{}', 1469, 0, @KeyboardsGuid, N'{}', 0);
GO

DECLARE @MousesGuid UNIQUEIDENTIFIER;
SET @MousesGuid = dbo.GetCategoryGuidByName(N'Mouses');

INSERT INTO dbo.Products(Name, SpecificationsJson, Price, InStock, CategoryId, ImagesUrlJson, PreviewImageIndex)
VALUES
	(N'HP X220 USB Black', N'{}', 469, 1, @MousesGuid, N'{}', 0),
	(N'Logitech G604 Wireless Gaming Mouse Lightspeed Black', N'{}', 2799, 1, @MousesGuid, N'{}', 0),
	(N'Greenwave GM-5083RGB Gaming RGB USB Black', N'{}', 329, 1, @MousesGuid, N'{}', 0),
	(N'Logitech G102 Prodigy USB Black', N'{}', 899, 1, @MousesGuid, N'{}', 0),
	(N'Logitech M170 Wireless Black/Grey', N'{}', 299, 0, @MousesGuid, N'{}', 0),
	(N'HyperX Pulsefire Dart Wireless Gaming Black', N'{}', 2399, 0, @MousesGuid, N'{}', 0),
	(N'HyperX Pulsefire FPS Pro RGB USB Black', N'{}', 1399, 1, @MousesGuid, N'{}', 0),
	(N'Razer Viper USB Black', N'{}', 2499, 1, @MousesGuid, N'{}', 0),
	(N'SteelSeries Rival 110 USB Black', N'{}', 999, 1, @MousesGuid, N'{}', 0),
	(N'Maxxter Mr-337-Gr Wireless Gray', N'{}', 119, 1, @MousesGuid, N'{}', 0),
	(N'Logitech B100 USB Black', N'{}', 189, 0, @MousesGuid, N'{}', 0),
	(N'HyperX Pulsefire Surge USB Black', N'{}', 1599, 1, @MousesGuid, N'{}', 0),
	(N'Lenovo Y Precision USB Black', N'{}', 799, 0, @MousesGuid, N'{}', 0),
	(N'Asus Cerberus Fortus USB Black', N'{}', 1215, 1, @MousesGuid, N'{}', 0),
	(N'Bloody R80 Wireless Skull Design', N'{}', 649, 1, @MousesGuid, N'{}', 0);
GO

DECLARE @HeadphonesGuid UNIQUEIDENTIFIER;
SET @HeadphonesGuid = dbo.GetCategoryGuidByName(N'Headphones');

INSERT INTO dbo.Products(Name, SpecificationsJson, Price, InStock, CategoryId, ImagesUrlJson, PreviewImageIndex)
VALUES
	(N'Apple AirPods Pro', N'{}', 7999, 1, @HeadphonesGuid, N'{}', 0),
	(N'Motorola Verve Buds 110 Black', N'{}', 999, 1, @HeadphonesGuid, N'{}', 0),
	(N'Razer Hammerhead True Wireless', N'{}', 3299, 0, @HeadphonesGuid, N'{}', 0),
	(N'Razer Kraken Ultimate Black', N'{}', 3399, 1, @HeadphonesGuid, N'{}', 0),
	(N'Nokia Power Earbuds BH-605 Black', N'{}', 1759, 1, @HeadphonesGuid, N'{}', 0),
	(N'Panasonic RP-HJE119EEA Blue', N'{}', 199, 1, @HeadphonesGuid, N'{}', 0),
	(N'Razer Kraken X Lite Multiplatform Black', N'{}', 1399, 1, @HeadphonesGuid, N'{}', 0),
	(N'Asus Cerberus V2 Black-Green', N'{}', 999, 1, @HeadphonesGuid, N'{}', 0),
	(N'Razer Kraken Essential V2 Black', N'{}', 1399, 0, @HeadphonesGuid, N'{}', 0),
	(N'SPEEDLINK Legatos Stereo Gaming Headset Black', N'{}', 199, 0, @HeadphonesGuid, N'{}', 0),
	(N'Edifier W800BT Red', N'{}', 995, 1, @HeadphonesGuid, N'{}', 0),
	(N'HyperX Cloud Silver', N'{}', 1899, 0, @HeadphonesGuid, N'{}', 0),
	(N'Xiaomi Redmi Airdots TWS Black', N'{}', 799, 1, @HeadphonesGuid, N'{}', 0),
	(N'Acme BH411 Advanced True wireless', N'{}', 799, 1, @HeadphonesGuid, N'{}', 0),
	(N'HyperX Cloud II (KHX-HSCP-GM) Gun Metal', N'{}', 2399, 1, @HeadphonesGuid, N'{}', 0);
GO

DECLARE @MicrowavesGuid UNIQUEIDENTIFIER;
SET @MicrowavesGuid = dbo.GetCategoryGuidByName(N'Microwaves');

INSERT INTO dbo.Products(Name, SpecificationsJson, Price, InStock, CategoryId, ImagesUrlJson, PreviewImageIndex)
VALUES
	(N'SAMSUNG ME81MRTS/BW', N'{}', 2299, 1, @MicrowavesGuid, N'{}', 0),
	(N'MIRTA MW-2501W ELEGANCE', N'{}', 1111, 1, @MicrowavesGuid, N'{}', 0),
	(N'SAMSUNG MS23F302TAS/UA', N'{}', 2999, 1, @MicrowavesGuid, N'{}', 0),
	(N'Toshiba MW2-MM20PF', N'{}', 1799, 1, @MicrowavesGuid, N'{}', 0),
	(N'PANASONIC NN-ST342MZPE', N'{}', 2599, 1, @MicrowavesGuid, N'{}', 0),
	(N'CANDY CMW 2070S', N'{}', 1399, 0, @MicrowavesGuid, N'{}', 0),
	(N'Toshiba MW-MM20P', N'{}', 1699, 1, @MicrowavesGuid, N'{}', 0),
	(N'SAMSUNG MS23K3614AS/BW', N'{}', 2799, 1, @MicrowavesGuid, N'{}', 0),
	(N'SAMSUNG ME81KRW-1/BW', N'{}', 2499, 1, @MicrowavesGuid, N'{}', 0),
	(N'Candy CMXG22DS', N'{}', 2199, 1, @MicrowavesGuid, N'{}', 0),
	(N'ERGO EM-2075', N'{}', 1299, 1, @MicrowavesGuid, N'{}', 0),
	(N'PANASONIC NN-SM221WZPE', N'{}', 1685, 0, @MicrowavesGuid, N'{}', 0),
	(N'SAMSUNG ME83KRS-2/BW', N'{}', 2699, 0, @MicrowavesGuid, N'{}', 0),
	(N'SHARP R200BKW', N'{}', 1549, 1, @MicrowavesGuid, N'{}', 0),
	(N'SAMSUNG ME81KRW-2/BW', N'{}', 2499, 1, @MicrowavesGuid, N'{}', 0);
GO

DECLARE @VacuumCleanersGuid UNIQUEIDENTIFIER;
SET @VacuumCleanersGuid = dbo.GetCategoryGuidByName(N'Vacuum Cleaners');

INSERT INTO dbo.Products(Name, SpecificationsJson, Price, InStock, CategoryId, ImagesUrlJson, PreviewImageIndex)
VALUES
	(N'ROWENTA Compact Power Cyclonic Home & Car RO3798EA', N'{}', 2899, 1, @VacuumCleanersGuid, N'{}', 0),
	(N'BOSCH BGC05AAA1', N'{}', 1999, 1, @VacuumCleanersGuid, N'{}', 0),
	(N'SAMSUNG POWERstick PRO VS80N8014KW/EV', N'{}', 9999, 1, @VacuumCleanersGuid, N'{}', 0),
	(N'ROWENTA X-Trem Power Cyclonic Facelift RO7283EA', N'{}', 4999, 1, @VacuumCleanersGuid, N'{}', 0),
	(N'PHILIPS SpeedPro FC6722/01', N'{}', 4999, 1, @VacuumCleanersGuid, N'{}', 0),
	(N'ELECTROLUX EER7ANIMAL', N'{}', 5999, 0, @VacuumCleanersGuid, N'{}', 0),
	(N'SAMSUNG VCC8836V36/SBW', N'{}', 2999, 0, @VacuumCleanersGuid, N'{}', 0),
	(N'BOSCH BWD 41740', N'{}', 5999, 1, @VacuumCleanersGuid, N'{}', 0),
	(N'ROWENTA X-Trem Power Cyclonic Home&Car RO6963EA 4AAAA Ecomotor', N'{}', 4799, 1, @VacuumCleanersGuid, N'{}', 0),
	(N'ROWENTA Air Force Flex 560 RH9471WO', N'{}', 9999, 1, @VacuumCleanersGuid, N'{}', 0),
	(N'ROWENTA Swift Power Cyclonic RO2932EA', N'{}', 1999, 0, @VacuumCleanersGuid, N'{}', 0),
	(N'BOSCH BGS2UCHAMP', N'{}', 4999, 1, @VacuumCleanersGuid, N'{}', 0),
	(N'PHILIPS SpeedPro Max Aqua FC6904/01', N'{}', 15999, 0, @VacuumCleanersGuid, N'{}', 0),
	(N'ROWENTA RO2957EA', N'{}', 2199, 1, @VacuumCleanersGuid, N'{}', 0),
	(N'ELECTROLUX ESC63EB', N'{}', 2999, 0, @VacuumCleanersGuid, N'{}', 0);
GO

DROP FUNCTION dbo.GetCategoryGuidByName;