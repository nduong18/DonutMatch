// "Every great game begins with a single scene. Let's make this one unforgettable!"
export class Game extends Phaser.Scene {
    constructor() {
        super('Game');

        this.donutList = ['orange_donut', 'blue_donut', 'pink_donut'];
        this.complimentText = ['EXCELLENT JOB!', 'GOOD JOB!', 'GREAT JOB!'];
        this.boxes = [];
        this.winner = false;
    }

    create() {
        this.cameras.main.setBackgroundColor(0x313131);
        this.sound.play('background_music', {loop: true, volume: 0.3});

        const width = this.scale.width;
        const height = this.scale.height;


        this.matter.add.rectangle(width/2, height+10, width, 20, { isStatic: true }); // bottom
        this.matter.add.rectangle(-10, height/2, 20, height, { isStatic: true }); // left
        this.matter.add.rectangle(width+10, height/2, 20, height, { isStatic: true }); // right

        const spacingX = 120;
        const spacingY = 120;

        const cols = Math.floor((width - 80) / spacingX);   
        const rows = Math.floor((height - 100) / spacingY);

        // Spawn Donuts
        for (let i = 0; i < rows; i++){
            for (let j = 0; j < cols; j++){
                const key = this.donutList[Math.floor(Math.random() * this.donutList.length)];
                const x = 100 + j * spacingX;
                const y = 100 + i * spacingY;
                let donut = this.matter.add.image(x,y,key);
                donut.type = key;

                donut.setScale(0.5);
                donut.setCircle(donut.width * 0.5 / 2);
                donut.setBounce(0.2);
                donut.setFriction(0.05);
                donut.setMass(1);

                donut.setInteractive();
                donut.on('pointerdown', () => this.onClickDonut(donut));
            }
        }

        // Header
        const boxW = 200;
        const boxH = 200;
        const boxCounts = this.donutList.length;
        const totalBoxWidth = boxCounts * boxW;
        const remainingSpace = width - totalBoxWidth;
        const boxSpacing = remainingSpace / (boxCounts + 1);

        this.add.graphics().fillStyle(0x000000, 1).fillRect(0, 0, width, 300);
        const boxY = 50;

        for (let i = 0; i < boxCounts; i++){
            const boxX = boxSpacing * (i + 1) + boxW * i;
            const box = this.add.graphics()
            .fillStyle(0x3e3e3d, 1)
            .fillRoundedRect(boxX, boxY, boxW, boxH, 20)
            .lineStyle(10, 0x515657, 1)
            .strokeRoundedRect(boxX, boxY, boxW, boxW, 20);

            box.centerX = boxX + boxW / 2;
            box.centerY = boxY + boxH / 2;

            this.add.image(boxX + boxW / 2, boxY + boxH / 3, this.donutList[i]).setScale(0.5);
            box.type = this.donutList[i];
            box.donutCounts = 11;
            box.text = this.add.text(boxX + boxW / 2, boxY + boxH / 1.2, "x" + box.donutCounts, {
                fontFamily: 'Arial Black',
                fontSize: '30px',
                color: '#FFF',
                stroke: '#000000',
                strokeThickness: 8
            }).setOrigin(0.5);
            this.boxes.push(box);
        }

    }

    onClickDonut(donut){
        if (donut.destroyed) return;
        donut.destroyed = true;

        this.onCompliment();

        donut.setSensor(true);
        donut.setIgnoreGravity(true);
        donut.setDepth(9999);

        let targetX = 0;
        let targetY = 0;
        let targetBox = null;
        for (let i = 0; i < this.boxes.length; i++){
            const box = this.boxes[i];
            if (donut.type === box.type){
                targetX = box.centerX;
                targetY = box.centerY;
                targetBox = box;
                if (box.donutCounts > 0){
                   box.donutCounts -= 1;
                }
                break;
            }
        }

        // tween di chuyển từ A → B trong 500ms
        this.tweens.add({
            targets: donut,
            x: targetX,
            y: targetY,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {
                if (targetBox){
                    targetBox.text.setText("x" + targetBox.donutCounts);
                }
                donut.destroy();

                // for (let i = 0; i < this.boxes.length; i++){
                //     if (this.boxes[i].donutCounts != 0) continue
                //     els
                // }
            }
        });
    }

    onCompliment(){
        this.sound.play('pop', {volume: 0.5});
        const index = Math.floor(Math.random() * this.complimentText.length);
        const comp = this.add.text(this.scale.width / 2, this.scale.height / 1.5, this.complimentText[index], {
            fontFamily: 'Arial Black',
            fontSize: '50px',
            color: '#FFF',
            stroke: '#000000',
            strokeThickness: 8 })
            .setOrigin(0.5).setScale(0);
        this.tweens.add({
            targets: comp,
            scale: 0.6,
            duration: 500,
            ease: 'Back.out',
            onComplete: () => comp.destroy()
        });
    }
}
