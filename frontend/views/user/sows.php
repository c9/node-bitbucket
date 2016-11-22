<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \common\models\LoginForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use frontend\models\SOW;

$this->title = 'SOWS';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="sows">
    <h1><?= Html::encode($this->title) ?></h1>

<table>
<tr>
<td>title</td>
<td>description</td>
</tr>
<?php 
/**
 * @var SOW $sow
 */
foreach($query as $sow) { ?>
    <tr>
    <td>
    <?= $sow->title ?>
    </td>
    <td>
    <?= $sow->description ?>
    </td>
    </tr>
    <?php }?>
</table>
    