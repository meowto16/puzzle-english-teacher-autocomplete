chrome.webNavigation.onHistoryStateUpdated.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, function([tab]){
    chrome.tabs.sendMessage(tab.id, { action: "locationchange" });
  });
})
