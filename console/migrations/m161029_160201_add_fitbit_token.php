<?php

use yii\db\Migration;

class m161029_160201_add_fitbit_token extends Migration
{
    public function up()
    {
        $this->execute("CREATE TABLE `fitbit` (
            `id` INT NOT NULL AUTO_INCREMENT,
              `access_token` VARCHAR(500) NOT NULL,
              `refresh_token` VARCHAR(500) NULL,
              `user_id` VARCHAR(500) NULL,
            `username` VARCHAR(500) NULL,
            `response` TEXT,
            `created` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            `has_subscription` TINYINT,
            PRIMARY KEY (`id`));
                    ");
    }

    public function down()
    {
        $this->execute("drop table fitbit;");
    }
}
