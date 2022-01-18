CREATE DATABASE shopenginedata;
GO
USE shopenginedata;

CREATE TABLE dbo.SiteAbouts(
	Id INT NOT NULL IDENTITY(1, 1),
	Name NVARCHAR(max) NOT NULL,
	Description NVARCHAR(max) NOT NULL,
	LogoUrl nvarchar(max) NOT NULL,
	ContactsInfo nvarchar(max) NOT NULL,
	CONSTRAINT PK_SiteAbouts
		PRIMARY KEY(Id)
);

CREATE TABLE dbo.EmailSettings(
	Id INT NOT NULL IDENTITY(1, 1),
	SenderName NVARCHAR(max) NOT NULL,
	EmailAddress NVARCHAR(max) NOT NULL,
	SmtpHost NVARCHAR(max) NOT NULL,
	SmtpPort INT NOT NULL,
	Password NVARCHAR(max) NOT NULL,
	CONSTRAINT PK_EmailSettings
		PRIMARY KEY(Id)
);

CREATE TABLE dbo.Categories(
	Id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
	SubCategoryGuid UNIQUEIDENTIFIER,
	Name NVARCHAR(max) NOT NULL,
	Description NVARCHAR(max) NOT NULL,
	CONSTRAINT PK_Categories
		PRIMARY KEY(Id)
);

CREATE TABLE dbo.Products(
	Id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
	CategoryId UNIQUEIDENTIFIER NOT NULL,
	Name NVARCHAR(max) NOT NULL,
	Description NVARCHAR(max),
	SpecificationsJson NVARCHAR(max) NOT NULL,
	Price MONEY NOT NULL,
	InStock BIT NOT NULL,
	ImagesUrlJson NVARCHAR(max) NOT NULL,
	PreviewImageIndex INT NOT NULL,
	CustomVendorCode INT,
	CONSTRAINT PK_Products
		PRIMARY KEY(Id),
	CONSTRAINT FK_Products_Categories
		FOREIGN KEY(CategoryId)
		REFERENCES dbo.Categories
);

CREATE TABLE dbo.Orders(
	Id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
	Number INT Identity(10000, 1),
	StateNumber INT NOT NULL,
	LogStatesChangesJson NVARCHAR(max),
	CustomerPhoneNumber NVARCHAR(max),
	CustomerEmail NVARCHAR(max),
	ProductsJson NVARCHAR(max),
	CONSTRAINT PK_Orders
		PRIMARY KEY(Id)
);