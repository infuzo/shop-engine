#pragma checksum "C:\Users\Infuzo\Documents\Projects\shop-engine\ShopEngine\ShopEngine\Views\AdminPanel\Categories.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "d033eaa0d4851a8fbfc914031d7a30b4bb574af9"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_AdminPanel_Categories), @"mvc.1.0.view", @"/Views/AdminPanel/Categories.cshtml")]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "C:\Users\Infuzo\Documents\Projects\shop-engine\ShopEngine\ShopEngine\Views\_ViewImports.cshtml"
using ShopEngine;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "C:\Users\Infuzo\Documents\Projects\shop-engine\ShopEngine\ShopEngine\Views\_ViewImports.cshtml"
using ShopEngine.Models;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"d033eaa0d4851a8fbfc914031d7a30b4bb574af9", @"/Views/AdminPanel/Categories.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"e85543a6a25fe0edfe7c1980401582534ee69bb8", @"/Views/_ViewImports.cshtml")]
    public class Views_AdminPanel_Categories : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<IEnumerable<ShopEngine.Models.CategoryModel>>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#nullable restore
#line 1 "C:\Users\Infuzo\Documents\Projects\shop-engine\ShopEngine\ShopEngine\Views\AdminPanel\Categories.cshtml"
  
	ViewData["Title"] = "View, add, change and remove categories";
	Layout = "~/Views/AdminPanel/_Layout.cshtml";

#line default
#line hidden
#nullable disable
            WriteLiteral(@"
<div class=""bordered"" style=""width: 410px; height: 400px; display: inline-block; float: left;"">
	<strong style=""margin: 5px 5px;"" >List of categories:</strong>
	<div class=""bordered"" id=""categoriesListParent"" style=""width: 395px; height: 300px; margin-left: 5px; margin-top: 5px; overflow: scroll; padding: 5px;"">
		
	</div>
	<button style=""display: block; margin: 5px auto;"" onclick=""addCategory(event)"">Add category</button>
</div> <div class=""bordered selectedCategoryForm"" style=""margin-left: 5px; padding: 10px 10px; width: 410px; height: 400px; display: inline-block; float: left;"">
	<br />
	<strong id=""selectedCategoryHeader"">HEADER_UNDEFINED_CONTENT</strong> <br /><br />
	<label for=""selectedCategoryName"">Name: </label><input type=""text"" required=""required"" max=""60"" id=""selectedCategoryName""/><br /><br />
	<label for=""selectedCategoryDescription"">Description: </label><textarea required=""required"" maxlength=""250"" id=""selectedCategoryDescription""></textarea><br /><br />
	<label for=""selectedCatego");
            WriteLiteral(@"rySubcatGuid"">Subcategory guid: </label><input type=""text"" id=""selectedCategorySubcatGuid"" /><br />
	<span><em>Paste guid of desired parent category here</em></span><br /><br /> <!--TODO: DropDownList-->

	<label for=""selectedCategoryGuid"">GUID: </label><input type=""text"" id=""selectedCategoryGuid"" readonly=""readonly"" /><br /><br />

	<br />
	<button style=""display: none;"" id=""selectedCategoryAdd"">Add/Save category</button> <button style=""display: none;"" id=""selectedCategoryRemove"">Remove category</button>
</div>

<script>
	const idCategoriesListParent = ""categoriesListParent"";
	const idSelectedCategoryHeader = ""selectedCategoryHeader"";
	const idSelectedCategoryName = ""selectedCategoryName"";
	const idSelectedCategoryDescription = ""selectedCategoryDescription"";
	const idSelectedCategorySubcatGuid = ""selectedCategorySubcatGuid"";
	const idSelectedCategoryGuid = ""selectedCategoryGuid"";
	const idSelectedCategoryButtonAdd = ""selectedCategoryAdd"";
	const idSelectedCategoryButtonRemove = ""selectedCate");
            WriteLiteral(@"goryRemove"";

	//TODO: from localization
	const textDefault = ""Select the category or add new one"";
	const textEditHeader = ""Editing the ""; 
	const textAddHeader = ""Adding the new category"";

	class Category {
		constructor(guid = """", subCatGuid = """", name = """", desc = """") {
			this.Id = guid;
			this.SubCategoryGuid = subCatGuid;
			this.Name = name;
			this.Description = desc;
		}

		setFromJson(jsonString) {
			let json = JSON.parse(jsonString);

			this.Id = json.id;
			this.SubCategoryGuid = json.subCategoryGuid;
			this.Name = json.name;
			this.Description = json.description;
		}

		getFormData() {
			return ""Id="" + encodeURIComponent(this.Id) + ""&SubCategoryGuid="" + encodeURIComponent(this.SubCategoryGuid) +
				""&Name="" + encodeURIComponent(this.Name) + ""&Description="" + encodeURIComponent(this.Description);
		}
	}

	function addCategoryToList(guid, subCatGuid, name, description) {
		let category = new Category(guid, subCatGuid, name, description);
		categories.push(ca");
            WriteLiteral(@"tegory);
	}

	function renderCategoryList() {
		var categoriesParent = document.getElementById(idCategoriesListParent);
		while (categoriesParent.firstChild != null) {
			categoriesParent.removeChild(categoriesParent.firstChild);
		}

		var roots = categories.filter(cat => cat.SubCategoryGuid == """" || cat.SubCategoryGuid == undefined);
		for (var rootCat of roots) {
			addCategoriesWithNesting(categoriesParent, rootCat, 0);
		}
	}

	function addCategoriesWithNesting(parent = HTMLElement, rootCategory = Category, nestingLevel = 0) {
		createCategoryLink(parent, rootCategory, nestingLevel);
		var childs = categories.filter(cat => cat.SubCategoryGuid == rootCategory.Id);
		nestingLevel++;
		for (child of childs) {
			addCategoriesWithNesting(parent, child, nestingLevel);
		}
	}

	function createCategoryLink(parent = HTMLElement, category = Category, nestingLevel = 0) {
		let newCategoryLink = document.createElement(""a"");
		newCategoryLink.href = ""#"";
		let innerText = """";
		console.lo");
            WriteLiteral(@"g(""Nesting level for "" + category.Name + "" is "" + nestingLevel);
		for (var index = 0; index < nestingLevel; index++) { innerText += ""-""; }
		console.log(""Inner text: "" + innerText);
		newCategoryLink.innerText = innerText + category.Name;

		newCategoryLink.addEventListener(""click"", (event) => selectCategory(event, category));

		parent.appendChild(newCategoryLink);
		parent.appendChild(document.createElement(""br""));
	}

	function setWaitingSelectedContent(header, value) {
		document.getElementById(idSelectedCategoryHeader).innerText = header;

		let currentStyleValue = value ? ""display: none;"" : ""display: inline-block;"";

		document.getElementById(idSelectedCategoryName).style = currentStyleValue;
		document.getElementById(idSelectedCategoryDescription).style = currentStyleValue;
		document.getElementById(idSelectedCategorySubcatGuid).style = currentStyleValue;
		document.getElementById(idSelectedCategoryGuid).style = currentStyleValue;
		document.getElementById(idSelectedCategoryButtonA");
            WriteLiteral(@"dd).style = currentStyleValue;
		document.getElementById(idSelectedCategoryButtonRemove).style = currentStyleValue;
	}

	function selectCategory(event, selectedCategory) {
		setWaitingSelectedContent(textEditHeader + selectedCategory.Name, false);

		document.getElementById(idSelectedCategoryName).value = selectedCategory.Name;
		document.getElementById(idSelectedCategoryDescription).value = selectedCategory.Description;
		document.getElementById(idSelectedCategorySubcatGuid).value = selectedCategory.SubCategoryGuid;
		document.getElementById(idSelectedCategoryGuid).value = selectedCategory.Id;

		document.getElementById(idSelectedCategoryButtonAdd).innerText = ""Save"";
		document.getElementById(idSelectedCategoryButtonAdd).onclick = (e) => editCategory(e, selectedCategory);
		document.getElementById(idSelectedCategoryButtonRemove).onclick = (e) => deleteSelectedCategory(e, selectedCategory);

		if (event != null) {
			event.stopPropagation();
		}
	}

	function editCategory(event, category");
            WriteLiteral(@") {
		event.stopPropagation();
		console.log(""Edit the "" + category.Name);
	}

	function deleteSelectedCategory(event, category) {
		let result = confirm(""Do you want to delete categery \"""" + category.Name + ""\""?"");
		if (result) {
			console.log(""Delete category "" + category.Id);
		}

		event.stopPropagation();
	}

	function addCategory(event, subCatGuid = """", name = """", desc = """") {
		setWaitingSelectedContent(textAddHeader, false);
		document.getElementById(idSelectedCategoryButtonRemove).style = ""display: none;"";

		document.getElementById(idSelectedCategoryName).value = name;
		document.getElementById(idSelectedCategoryDescription).value = desc;
		document.getElementById(idSelectedCategorySubcatGuid).value = subCatGuid;
		document.getElementById(idSelectedCategoryGuid).value = """";

		document.getElementById(idSelectedCategoryButtonAdd).innerText = ""Add"";
		document.getElementById(idSelectedCategoryButtonAdd).onclick =
			(e) => {
				let category = new Category("""",
					documen");
            WriteLiteral(@"t.getElementById(idSelectedCategorySubcatGuid).value,
					document.getElementById(idSelectedCategoryName).value,
					document.getElementById(idSelectedCategoryDescription).value);
				onAddCategory(e, category);
			};

		if (event != null) {
			event.stopPropagation();
		}
	}

	function onAddCategory(event, category = new Category()) {
		event.stopPropagation();

		if (category.Name == """" || category.Description == """") {
			alert(""Name and description should have values."");
			return;
		}

		setWaitingSelectedContent(""Category is adding... Please wait"", true);

		let request = new XMLHttpRequest();
		request.open(""POST"", ""/AdminPanel/AddCategory"");
		request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
		request.onreadystatechange = () => {
			if (request.readyState == 4) {
				if (request.status == 200) {
					var addedObject = new Category();
					addedObject.setFromJson(request.responseText);
					addCategoryToList(addedObject.Id, adde");
            WriteLiteral(@"dObject.SubCategoryGuid, addedObject.Name, addedObject.Description);
					renderCategoryList();
					selectCategory(null, addedObject);
				}
				else {
					alert(""Adding the new category failed.\n"" + request.responseText);
					setWaitingSelectedContent("""", false);
					addCategory(null, category.SubCategoryGuid, category.Name, category.Description);
				}
			}
		};

		request.send(category.getFormData());
	}

	var categories = [];
	setWaitingSelectedContent(textDefault, true);
</script>");
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<IEnumerable<ShopEngine.Models.CategoryModel>> Html { get; private set; }
    }
}
#pragma warning restore 1591
