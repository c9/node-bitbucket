<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \common\models\LoginForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use frontend\models\SOW;

$this->title = 'Fitbit Users';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="fitbit-users">
    <h1><?= Html::encode($this->title) ?></h1>

<table>
<tr>
<td>id</td>
<td>access_token</td>
<td>refresh_token</td>
<td>has_subscription</td>
</tr>
<?php 
/**
 * @var SOW $sow
 */
foreach($query as $fitbit) { ?>
    <tr>
    <td>
    <?= $fitbit->user_id ?>
    </td>
    <td>
    <pre><?= $fitbit->access_token ?></pre>
    </td>
    <td>
    <pre><?= $fitbit->refresh_token ?></pre>
    </td>
    <td>
    <?= $fitbit->has_subscription ?>
    </td>
    </tr>
    <?php }?>
</table>
    