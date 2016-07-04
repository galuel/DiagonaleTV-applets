jQuery.ajaxSetup({ cache: true });
jQuery.getScript("https://static.jappix.com/server/get.php?l=fr&t=js&g=mini.xml", function() {
   JappixMini.launch({
      connection: {
         domain: "anonymous.jappix.com",
      },
       application: {
         network: {
            autoconnect: false,
         },
          interface: {
            showpane: true,
            animate: true,
         },
          user: {
            random_nickname: false,
         },
         groupchat: {
            open: ["ffe@muc.jappix.com"],
         },
      },
   });
});
