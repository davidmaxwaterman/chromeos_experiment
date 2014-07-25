$(document).ready(function() {
  var monitor_node = function( target, do_this ) {
    // Create an observer instance
    var observer = new MutationObserver(function(mutations,observerInstance) {
      mutations.forEach(function(mutation) {
        var new_nodes = mutation.addedNodes; // DOM NodeList
        if (new_nodes !== null) { // If there are new nodes added
          var $nodes = $(new_nodes); // jQuery set
          do_this($nodes,observerInstance);
        }
      });
    });

    // Configuration of the observer:
    var config = {
      //attributes: true,
      childList: true,
      subtree: true,
      //characterData: true
    };

    // Pass in the target node, as well as the observer options
    observer.observe(target, config);
  };

  var $library_container=$('#KindleLibraryContainer');
  if ($library_container.length>0) {
    monitor_node($library_container[0],function($new_nodes,observerInstance) {
      var $iframe=$('#KindleLibraryIFrame');

      $iframe.on('load',function() {
        var $html=$iframe.contents().find("html").first();
        monitor_node($html[0],function($new_nodes,observerInstance) {
          $new_nodes.find('.book_container').each(function() {
            var $container=$(this);
            var $image=$container.find(".book_image");
            var title=$container.find(".book_title").text();
            var author=$container.find(".book_author").text();

            console.log("Title:",title);
            console.log("Author:",author);
            console.log("Link:",$image[0].outerHTML);

            // we have our info so we're done
            observerInstance.disconnect();
          });
        });
      });

      // we're now monitoring the iframe
      // so we're done monitoring the container
      observerInstance.disconnect();
    });
  }

});
