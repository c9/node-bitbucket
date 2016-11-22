<?php

use yii\db\Migration;

class m160818_014622_sow2 extends Migration
{
    public function up()
    {
        $this->execute("CREATE TABLE `sow2` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `description` text,
          `title` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
          `phone` varchar(255) COLLATE utf8_unicode_ci NULL,
          `email` varchar(255) COLLATE utf8_unicode_ci NULL,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;");
    }

    public function down()
    {
        echo "m160818_014622_sow2 cannot be reverted.\n";

        return false;
    }

    /*
    // Use safeUp/safeDown to run migration code within a transaction
    public function safeUp()
    {
    }

    public function safeDown()
    {
    }
    */
}
