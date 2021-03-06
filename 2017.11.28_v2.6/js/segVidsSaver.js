if (window.location.href.indexOf('chrome-extension:') !== -1 && window.location.href.indexOf('download.html') !== -1) {

chrome.storage.local.get(null, function(items) {   
    if (items.slices) {   
        
        for  (var key in items.slices) {
            if (items.slices[key].length > 0) {
                      
                // adobe HDS streaming videos
                if(items.videoType === 'hds') {
                    
                    (function(key) {
                        // get info from the manifest
                        $.ajax({
                            type: "GET",
                            url: key,
                            dataType: 'xml',  
                            success: function (obj, textstatus) {
                                try {
                                    
                                    const simpleXmlObj = utils.simplexml_load_string(obj);  
                                    const manifestXml = obj.children[0];
                                    adobe.parseManifest(simpleXmlObj, manifestXml, key);                                   
                                   
                                    for (let i = 0; i < F4F.HDS.getMediaLength(); i++) {
                                        let curMediaItem = F4F.HDS.getMediaArray()[i];
                                        //debugger;
                                        
                                        (function(curMediaItem) {
                                            
                                            let a = document.createElement('a');
                                            a.title = curMediaItem[1].url + ' (bitrate: ' + curMediaItem[0] + ')';
                                            a.text = curMediaItem[1].url + ' (bitrate: ' + curMediaItem[0] + ')';
                                            
                                            
                                            a.onclick = function() {                                            
                                                
                                                F4F.HDS.clearPrevInfo();
                                                adobe.downloadFragments(obj, curMediaItem);                       
                                            };
                                            


                                            document.getElementById('hlsLinks').appendChild(a);
                                            let br = document.createElement('br');
                                            document.getElementById('hlsLinks').appendChild(br);
                                            let br2 = document.createElement('br');
                                            document.getElementById('hlsLinks').appendChild(br2);
                                            
                                        })(curMediaItem);
                                    }

                                    F4F.HDS.clearMediaArray();
                                   
                                }
                                catch(e) {
                                    debugger;   
                                }

                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {    
                                debugger;
                            }
                        });

           
                    })(key);
                }
        
                // apple HLS streaming videos
                else if (items.videoType === 'hls' && key.indexOf('.f4m') === -1){ 

                    var a = document.createElement('a');
                    a.title = key;
                    a.text = key;

                    a.onclick = window.adobeHdsHlsVideoSaver.downloadSlices.bind(null, {
                        slices: items.slices,
                        url: key
                    });

                    document.getElementById('hlsLinks').appendChild(a);

                    var br = document.createElement('br');
                    document.getElementById('hlsLinks').appendChild(br);
                    var br2 = document.createElement('br');
                    document.getElementById('hlsLinks').appendChild(br2);

                
                }
            }
        }
    }
});
}

var setUp = function() {
    if (document.getElementById('hlsClearBtn')) {
        document.getElementById('hlsClearBtn').onclick = function () {
            document.getElementById('hlsMain').innerHTML = "";        
            chrome.storage.local.remove('slices');
            chrome.extension.sendMessage({type: "urls", value: []});
            chrome.extension.sendMessage({type: "slices", value: {}});
        };
    }
};

document.addEventListener('DOMContentLoaded', setUp);