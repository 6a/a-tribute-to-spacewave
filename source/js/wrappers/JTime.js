J.TIME = function (running)
{
    var t_prev = 0;

    this.delta = 0;
    this.time = 0;
    this.paused = !running;

    this.tick = function ()
    {
        this.delta = (performance.now() / 1000) - t_prev;

        t_prev = performance.now() / 1000;

        if (!this.paused)
        {
            this.time = this.time + this.delta;
        }
        else
        {
            this.delta = 0;
        }
    };
};