var tabsContainer = ".user-profile-tabs-container";

var selectTabHandler = function(event) {
	$tab = $(this);
	$(tabsContainer + "li").removeClass("active");
	$tab.parent().addClass("active");
	selectedTabName = $tab.attr("href");
	console.log(selectedTabName);
	$(".tab-pane").addClass("hidden");
	$(selectedTabName).removeClass("hidden");
	event.preventDefault();
};