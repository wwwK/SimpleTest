/**
 * Created by Jiachong on .2019-09-11 17:39:31 
 */


function showFps() {
    //帧率插件
    var stats = new Stats()
    stats.showPanel(0);

    var fpsPanel = $('.fps');
    fpsPanel.append(stats.dom);

    function animate() {
        stats.begin();
        //……
        stats.end();

        requestAnimationFrame(animate);

    }

    requestAnimationFrame(animate);
}