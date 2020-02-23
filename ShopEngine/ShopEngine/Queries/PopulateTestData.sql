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
	(N'Induction oven', N'Induction oven', @KitchenAppliances);
GO

DROP FUNCTION dbo.GetCategoryGuidByName;