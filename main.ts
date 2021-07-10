namespace SpriteKind {
    export const darkness = SpriteKind.create()
    export const trapTile = SpriteKind.create()
    export const Item = SpriteKind.create()
    export const Signboard = SpriteKind.create()
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    projectileDirectionX = 100
    projectileDirectionY = 0
})
// タイルマップ切り替えテスト。今は使っていない　2021/7/1
function getAlignmentOriginY (sprite: Sprite) {
    return sprite.y + sprite.height / 2
}
function initTileMapConnection () {
    tilemap2 = tiles.createMap(tilemap`level_2`)
    tiles.connectMapById(tilemap1, tilemap2, ConnectionKind.Door1)
}
function getDistance (x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((y1 - y2) * (y1 - y2) + (x1 - x2) * (x1 - x2))
}
function getAlignmentOriginX (sprite: Sprite) {
    return sprite.x + sprite.width / 2
}
scene.onOverlapTile(SpriteKind.Player, tiles.util.door0, function (sprite, location) {
    tiles.loadConnectedMap(ConnectionKind.Door1)
    tiles.placeOnRandomTile(sprite, sprites.dungeon.collectibleInsignia)
    console.log("aaaaa")
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    projectileDirectionX = 0
    projectileDirectionY = 100
})
info.onCountdownEnd(function () {
    music.stopAllSounds()
    game.over(false, effects.dissolve)
})
scene.onOverlapTile(SpriteKind.Player, sprites.dungeon.collectibleBlueCrystal, function (sprite, location) {
    if (getDistance(getAlignmentOriginX(sprite), getAlignmentOriginY(sprite), tiles.locationXY(location, tiles.XY.x) + 8, tiles.locationXY(location, tiles.XY.y) + 8) < 5) {
        music.zapped.play()
        sprite.setFlag(SpriteFlag.Ghost, true)
        controller.moveSprite(sprite, 0, 0)
        animation.runImageAnimation(
        sprite,
        assets.animation`myAnimWarp0`,
        100,
        false
        )
        timer.after(1000, function () {
            sprite.setVelocity(-50, 0)
        })
    }
})
scene.onOverlapTile(SpriteKind.Player, sprites.dungeon.chestClosed, function (sprite, location) {
    info.stopCountdown()
    StopBgm = 1
    music.stopAllSounds()
    controller.moveSprite(mySprite, 0, 0)
    tiles.replaceAllTiles(sprites.dungeon.chestClosed, sprites.dungeon.chestOpen)
    effects.confetti.startScreenEffect()
    mySprite.say("きょうとう　せんせいの　パンツの中を　しらべろ", 20000)
    timer.after(20000, function () {
        game.reset()
    })
    pause(100)
    music.magicWand.play()
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    projectileDirectionX = -100
    projectileDirectionY = 0
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.trapTile, function (sprite, otherSprite) {
    if (getDistance(getAlignmentOriginX(sprite), getAlignmentOriginY(sprite), getAlignmentOriginX(otherSprite), getAlignmentOriginY(otherSprite)) < 5) {
        tiles.setWallAt(tiles.locationOfSprite(otherSprite), true)
        otherSprite.destroy()
        music.buzzer.play()
        sprite.startEffect(effects.ashes)
        animation.runImageAnimation(
        sprite,
        assets.animation`myAnimeBlinking`,
        100,
        true
        )
        controller.moveSprite(mySprite, 0, 0)
        sprite.setVelocity(0, 0)
        pause(2000)
        controller.moveSprite(mySprite, 50, 50)
        animation.runImageAnimation(
        sprite,
        assets.animation`myAnim`,
        200,
        true
        )
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    projectile = sprites.createProjectileFromSprite(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . 2 2 2 . . . . . . 
        . . . . . . 2 3 1 3 2 . . . . . 
        . . . . . . 2 1 1 1 2 . . . . . 
        . . . . . . 2 3 1 3 2 . . . . . 
        . . . . . . . 2 2 2 . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, mySprite, projectileDirectionX, projectileDirectionY)
    projectile.startEffect(effects.fire, 200)
})
// 処理落ちしてリアルタイムは無理だったから没。
function initDarkness () {
    picture = image.create(30, 30)
    picture.fill(15)
    picture.fillRect(mySprite.x - scene.cameraProperty(CameraProperty.X) + 55, mySprite.y - scene.cameraProperty(CameraProperty.Y) + 35, 50, 50, 0)
    mySprite2 = sprites.create(picture, SpriteKind.darkness)
    mySprite2.setStayInScreen(true)
}
function InitTileMap () {
    tilemap1 = tiles.createMap(tilemap`level_3`)
    tiles.loadMap(tilemap1)
    tiles.placeOnRandomTile(mySprite, sprites.dungeon.collectibleInsignia)
    scene.cameraFollowSprite(mySprite)
    for (let 値 of tiles.getTilesByType(assets.tile`hole`)) {
        mySprite4 = sprites.create(assets.image`myImage`, SpriteKind.trapTile)
        tiles.placeOnTile(mySprite4, 値)
        tiles.coverAllTiles(sprites.dungeon.floorDark1, assets.image`myImage0`)
    }
}
function InitCharcter () {
    mySprite = sprites.create(img`
        . . . . . . f f f f . . . . . . 
        . . . . f f f 2 2 f f f . . . . 
        . . . f f f 2 2 2 2 f f f . . . 
        . . f f f e e e e e e f f f . . 
        . . f f e 2 2 2 2 2 2 e e f . . 
        . . f e 2 f f f f f f 2 e f . . 
        . . f f f f e e e e f f f f . . 
        . f f e f b f 4 4 f b f e f f . 
        . f e e 4 1 f d d f 1 4 e e f . 
        . . f f f f d d d d d e e f . . 
        . f d d d d f 4 4 4 e e f . . . 
        . f b b b b f 2 2 2 2 f 4 e . . 
        . f b b b b f 2 2 2 2 f d 4 . . 
        . . f c c f 4 5 5 4 4 f 4 4 . . 
        . . . f f f f f f f f . . . . . 
        . . . . . f f . . f f . . . . . 
        `, SpriteKind.Player)
    controller.moveSprite(mySprite, 50, 50)
    mySprite.z = 1
    animation.runImageAnimation(
    mySprite,
    assets.animation`myAnim`,
    200,
    true
    )
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    projectileDirectionX = 0
    projectileDirectionY = -100
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    for (let 値2 of tiles.getTilesByType(sprites.dungeon.floorDarkDiamond)) {
        if (tiles.locationXY(tiles.locationOfSprite(mySprite), tiles.XY.row) == tiles.locationXY(値2, tiles.XY.row)) {
            if (tiles.locationXY(tiles.locationOfSprite(mySprite), tiles.XY.column) == tiles.locationXY(値2, tiles.XY.column)) {
                game.showLongText("ゆか　の\\nきれつ に\\nちゅういして…\\n", DialogLayout.Center)
            }
        }
    }
})
let BgmCount = 0
let mySprite4: Sprite = null
let mySprite2: Sprite = null
let picture: Image = null
let projectile: Sprite = null
let mySprite: Sprite = null
let tilemap1: tiles.WorldMap = null
let tilemap2: tiles.WorldMap = null
let projectileDirectionY = 0
let projectileDirectionX = 0
let StopBgm = 0
StopBgm = 0
let SettingTest = blockSettings.readNumber("test")
if (SettingTest != 1) {
    blockSettings.writeNumber("test", 1)
    music.powerUp.play()
}
InitCharcter()
InitTileMap()
game.splash("青小ダンジョン", "ゲームをクリアしろ！")
music.baDing.play()
game.showLongText("30びょう で\\nたからばこ を\\nみつけだせ！\\n", DialogLayout.Center)
info.startCountdown(30)
game.onUpdate(function () {
    if (mySprite.flags == SpriteFlag.Ghost) {
        if (tiles.tileIs(tiles.getTileLocation(tiles.locationXY(tiles.locationOfSprite(mySprite), tiles.XY.column), tiles.locationXY(tiles.locationOfSprite(mySprite), tiles.XY.row)), assets.tile`myTile0`)) {
            music.zapped.play()
            controller.moveSprite(mySprite, 50, 50)
            mySprite.setFlag(SpriteFlag.Ghost, false)
            animation.runImageAnimation(
            mySprite,
            assets.animation`myAnimWarp1`,
            100,
            false
            )
            timer.after(1000, function () {
                animation.runImageAnimation(
                mySprite,
                assets.animation`myAnim`,
                200,
                true
                )
            })
        }
    }
})
forever(function () {
    if (StopBgm == 1) {
        music.stopAllSounds()
    } else {
        music.playMelody("E D G F B A C5 B ", 80 + 20 * BgmCount)
        BgmCount += 1
    }
})
